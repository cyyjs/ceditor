import { BrowserWindow, ipcMain } from 'electron'
import Qs from 'querystring'
import Config from '../config'
import axios from 'axios'
let options = {
  client_id: Config.ClientID,
  client_secret: Config.ClientSecret,
  scopes: ['user:email', 'public_repo'] // Scopes limit access for OAuth tokens.
}

function requestGithubToken (options, code) {
  let token
  axios.post('https://github.com/login/oauth/access_token', {
    client_id: Config.ClientID,
    client_secret: Config.ClientSecret,
    code: code
  }).then(res => {
    let data = Qs.parse(res.data)
    token = data.access_token
    return axios.get('https://api.github.com/user', { headers: { 'Authorization': 'bearer ' + token } })
  }).then(res => {
    let data = res.data
    let user = {
      id: data.id,
      name: data.name,
      avatarUrl: data.avatar_url,
      blog: data.blog,
      email: data.email,
      location: data.location,
      bio: data.bio,
      githubAccount: data.login,
      githubToken: token
    }
    ipcMain.emit('logined', {
      token,
      user
    })
  }).catch(function (error) {
    ipcMain.emit('message', {
      title: '登录失败',
      type: 'error',
      message: error
    })
  })
}

function OAuthWin () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    nodeIntegration: false,
    fullscreen: false,
    minimizable: false,
    maximizable: false,
    resizable: false,
    alwaysOnTop: true
  })
  let authUrl = Config.githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes
  win.loadURL(authUrl)

  function handleCallback (url) {
    let rawCode = /code=([^&]*)/.exec(url) || null
    let code = (rawCode && rawCode.length > 1) ? rawCode[1] : null
    let error = /\?error=(.+)$/.exec(url)

    if (code || error) {
      win.hide()
    }

    if (code) {
      requestGithubToken(options, code)
    } else if (error) {}
  }

  win.webContents.on('will-navigate', function (event, url) {
    handleCallback(url)
  })

  win.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    handleCallback(newUrl)
  })
  win.on('close', function () {
    ipcMain.emit('loginClose')
    win = null
  })
  return win
}
export default OAuthWin
