'use strict'
import axios from 'axios'
import { ipcRenderer } from 'electron'
// const { app } = require('electron').remote
import {PostDB} from '../renderer/store/db'
const Shell = require('shelljs')
const Path = require('path')
Shell.env.PATH += Path.delimiter + '/usr/local/bin' // 添加环境变量
const fs = require('fs')
// const Path = require('path')

// 初始化导入文章
function ImportPosts (path, user) {
  let postPath = path + '/source/_posts/'
  return new Promise(async (resolve, reject) => {
    Shell.cd(postPath)
    Shell.ls('*.md').forEach(async (file) => {
      let post = Shell.cat(file).toString()
      let r = await SavePost(post, user)
      if (r._id) {
        Shell.mv(`${file}`, `${r._id}.md`)
      }
    })
    resolve()
  })
}

async function SavePost (post, user) {
  let posts = post.split('---\n').slice(1)
  let meta = posts.shift().split('\n')
  let content = posts.join('---\n').replace(/^(\n)*/, '').trim()
  let heads = {}
  meta.forEach((item) => {
    if (item.includes(':')) {
      let vs = item.split(':')
      let k = vs[0]
      let v = vs.slice(1).join(':').trim()
      if (k === 'tags') {
        v = v.replace(/\[|\]/g, '').split(',')
      } else if (k === 'date' || k === 'updated') {
        v = new Date(v) || new Date()
      }
      heads[k] = v
    }
  })
  let data = {
    ...heads,
    userID: user._id,
    publish: true,
    content
  }
  let o = await PostDB.findOne({title: data.title, date: data.date})
  if (o) {
    await PostDB.update({title: data.title, date: data.date}, {$set: data})
    return {}
  } else {
    let r = await PostDB.insert(data)
    return r
  }
}

// 命令执行，返回 promise
function Exec (cmd, errmsg) {
  return new Promise((resolve, reject) => {
    Shell.exec(cmd, { silent: true }, function (code, stdout, stderr) {
      if (!code) {
        return resolve(stdout)
      } else {
        return reject(errmsg || stderr)
      }
    })
  })
}

// 修改blog配置文件
function UpdateConfig (path, user) {
  let configPath = Path.join(__static, '_config.yml')
  let file = path + '/_config.yml'
  let blog = user.blog || 'http://' + user.githubAccount + '.github.io'
  let repo = `https://github.com/${user.githubAccount}/${user.githubAccount}.github.io.git`
  return new Promise(async (resolve, reject) => {
    await Exec(`cp ${configPath} ${path}`)
    Shell.sed('-i', /__title__/, user.name, file)
    Shell.sed('-i', /__subtitle__/, user.bio, file)
    Shell.sed('-i', /__author__/, user.name, file)
    Shell.sed('-i', /__url__/, blog, file)
    Shell.sed('-i', /__repo__/, repo, file)
    Shell.sed('-i', /__name__/, user.githubAccount, file)
    Shell.sed('-i', /__email__/, user.email, file)
    resolve()
  })
}

// 初始化git项目
function initGithubRepos (user) {
  let name = user.githubAccount + '.github.io'
  return new Promise((resolve, reject) => {
    axios.post('https://api.github.com/user/repos', {
      name
    }, {
      headers: { 'Authorization': 'bearer ' + user.githubToken }
    }).then(res => {
      resolve()
    }).catch(() => {
      reject(new Error('github 初始化项目失败'))
    })
  })
}

export default class {
  // 是否安装了nodejs、git
  static isReady () {
    let isready = !!Shell.which('node') && !!Shell.which('git') && !!Shell.which('npm')
    return isready
  }

  static async initBlog (path, user) {
    try {
      // 安装hexo
      if (!Shell.which('hexo')) {
        await Exec('npm install -g hexo-cli --registry=https://registry.npm.taobao.org')
      }

      let ls = [...Shell.ls(path)]
      if (ls.includes('_config.yml')) { // 如果选择的目录已经初始化过，导入里面的文档
        await ImportPosts(path, user)
      } else { // 初始化blog文件
        console.log(path)
        Shell.cd(path)
        await Exec('hexo init && npm install --registry=https://registry.npm.taobao.org')
        await Exec('npm install hexo-deployer-git -S --registry=https://registry.npm.taobao.org')
        let defaultMd = Path.join(__static, 'hello_ceditor.md')
        await Exec('rm source/_posts/hello-world.md')
        await Exec(`cp ${defaultMd} source/_posts/`)
        await UpdateConfig(path, user)
        await initGithubRepos(user)
        await Exec(`hexo generate --deploy`, '尝试发布部署失败')
        ipcRenderer.send('message', {
          title: '系统提示',
          type: 'success',
          message: '博客初始化成功'
        })
      }
      return
    } catch (e) {
      let err = String(e)
      if (err.includes('please run `hexo init` on an empty ')) {
        return '请选择为空的目录'
      }
      ipcRenderer.send('message', {
        title: '系统提示',
        type: 'error',
        message: e.message || e
      })
      return e.message || e
    }
  }

  static async publish (data, _id, user) {
    if (!user.blogPath) {
      return false
    }
    let postPath = Path.join(user.blogPath, `source/_posts/${_id}.md`)
    data += '\n<div style="text-align:right;font-size:12px;color:#666;">----publish by <a href="http://ceditor.alibt.top" target="_blank">CEditor</a></div>'
    fs.writeFileSync(postPath, data)
    Shell.cd(user.blogPath)
    try {
      await Exec(`hexo generate --deploy`, '尝试发布部署失败')
      await PostDB.update({ _id }, { $set: { publish: true } })
      ipcRenderer.send('message', {
        title: '系统提示',
        type: 'success',
        message: '发布成功'
      })
      return
    } catch (e) {
      ipcRenderer.send('message', {
        title: '系统提示',
        type: 'error',
        message: e.message || '发布失败'
      })
      return e.message || e
    }
  }

  static async dePublish (_id, user) {
    if (!user.blogPath) {
      return false
    }
    let postPath = Path.join(user.blogPath, `source/_posts/${_id}.md`)
    Shell.rm(postPath)
    try {
      await Exec(`hexo generate --deploy`, '尝试发布部署失败')
      await PostDB.update({ _id }, { $set: { publish: false } })
      ipcRenderer.send('message', {
        title: '系统提示',
        type: 'success',
        message: '已取消发布'
      })
    } catch (e) {
      ipcRenderer.send('message', {
        title: '系统提示',
        type: 'error',
        message: '取消发布失败'
      })
      return e.message || e
    }
  }
}
