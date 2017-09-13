'use strict'

import { app, BrowserWindow, Menu, Tray, ipcMain } from 'electron'

import {MyMenu, OAuthWin, Message} from '../lib'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

global.__winurl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`
let mainWindow, tray
function createWindow () {
  OAuthWin()
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 720,
    useContentSize: true,
    width: 1110,
    titleBarStyle: 'hidden',
    // backgroundColor: '#2e2c29',
    minWidth: 1110,
    minHeight: 720,
    show: false
  })
  // mainWindow.webContents.openDevTools()
  mainWindow.loadURL(__winurl)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('focus', () => {
    MyMenu.showEditor()
  })
  // loginWin.on('closed', () => {
  //   loginWin = null
  // })
  Message.init()
  ipcMain.on('logined', function (data) {
    // loginWin.close()
    // mainWindow.loadURL(__winurl)
    // mainWindow.show()
    mainWindow.webContents.send('logined', data)
  })
}

function showMainWindow () {
  if (mainWindow === null) {
    createWindow()
  } else {
    mainWindow.show()
  }
}

app.on('ready', () => {
  createWindow()
  tray = new Tray(__static + '/img/c1.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: '显示主界面', click: showMainWindow},
    {label: '退出', click: function () { app.quit() }}
  ])
  tray.setToolTip(app.getName())
  tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  showMainWindow()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
