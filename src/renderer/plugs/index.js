'use strict'
import { ipcRenderer } from 'electron'
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
}
export default { install }
