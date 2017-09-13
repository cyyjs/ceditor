'use strict'
import Config from '../../config'
import { ipcRenderer } from 'electron'
const qiniu = require('qiniu')
const uuidv1 = require('uuid/v1')
let mac = new qiniu.auth.digest.Mac(Config.qiniuAccessKey, Config.qiniuSecretKey)
// let persistentOps = 'imageView2/0/format/webp/interlace/1/q/100|imageslim'
let qconfig = new qiniu.conf.Config()
qconfig.zone = qiniu.zone.Zone_z2
let formUploader = new qiniu.form_up.FormUploader(qconfig)
let putExtra = new qiniu.form_up.PutExtra()
let url = Config.qiniuUrl
function uptoken (key) {
  let putPolicy = new qiniu.rs.PutPolicy({
    scope: 'ceditor:' + key
    // persistentOps
  })
  return putPolicy.uploadToken(mac)
}

export default class {
  static upload (file) {
    return new Promise((resolve, reject) => {
      let key = uuidv1()
      let token = uptoken(key)
      formUploader.putFile(token, key, file.path, putExtra, function (respErr, respBody, respInfo) {
        if (respBody.hash) {
          return resolve(url + respBody.key)
        } else {
          ipcRenderer.send('message', {
            title: '文件上传',
            type: 'error',
            message: '文件上传失败'
          })
          return resolve()
        }
      })
    })
  }
}
