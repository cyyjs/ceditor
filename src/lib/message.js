'use strict'
import { ipcMain, Notification, nativeImage } from 'electron'

export default class {
  static init () {
    let iconMap = {
      success: nativeImage.createFromPath(__static + '/img/success.png'),
      warning: nativeImage.createFromPath(__static + '/img/warning.png'),
      error: nativeImage.createFromPath(__static + '/img/error.png')
    }
    ipcMain.on('message', function (event, arg) {
      let {title, type = 'warning', message} = arg
      let n = new Notification({
        icon: iconMap[type],
        title,
        body: message
      })
      n.show()
    })
  }
}
