'use strict'
import { ipcRenderer, shell } from 'electron'
/**
 * 自定义插件
 */

function install (Vue, options) {
  // 系统通知
  Vue.prototype.$message = function (opt) {
    ipcRenderer.send('message', opt)
  }

  // 发送通知
  Vue.prototype.$send = function (msg, opt) {
    ipcRenderer.send(msg, opt)
  }

  // 打开浏览器
  Vue.prototype.$openUrl = function (url) {
    shell.openExternal(url)
  }
}
export default { install }
