'use strict'
import Blog from './blog'
const { dialog, BrowserWindow, app } = require('electron').remote
const fs = require('fs')
const path = require('path')
const userDataPath = app.getPath('userData')
const moment = require('moment')

// 获取保存路径
function selectPathForWrite (filters, filename = '未命名') {
  var filePath = dialog.showSaveDialog({
    filters,
    properties: ['createDirectory'],
    defaultPath: filename,
    title: '导出',
    buttonLabel: '导出'
  })
  if (!filePath) return
  return filePath
}

// 读取文本内容
function getFileText (filePath) {
  filePath = path.join(__static, filePath)
  return fs.readFileSync(filePath, 'utf8')
}

function getHtml (title, body) {
  let css = getFileText('md.css')
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="author" content="CEditor">
      <title>${title}</title>
      <style>${css}</style>
    </head>
    <body class="markdown-body code-github">
      <h1>${title}</h1>
      ${body}
    </body>
  </html>`
}

export default class {
  // 导出文件
  static async export ({ _id, postMate, type, mk, html }, user) {
    var filters = [{
      name: postMate.title,
      extensions: [type]
    }]
    if (type === 'hexo') {
      let date = moment().format('YYYY-MM-DD HH:mm:ss')
      let body = `---\ncategory: ${postMate.category}\ntitle: ${(postMate.title || '').trim()}\ndate: ${date}\ntags: ${JSON.stringify(postMate.tags || [])}\n---\n\n${(mk || '').trim()}`
      // console.log(body)
      let r = await Blog.publish(body, _id, user)
      return r
    }

    let filePath = selectPathForWrite(filters, postMate.title)
    if (!filePath) {
      return
    }
    let content
    if (type === 'md') {
      content = mk
      fs.writeFileSync(filePath, content, 'utf8')
    } else if (type === 'html') {
      content = getHtml(postMate.title, html)
      fs.writeFileSync(filePath, content, 'utf8')
    } else if (type === 'pdf') {
      content = getHtml(postMate.title, html)
      let tmpPath = path.join(userDataPath, 'tmp.html')
      fs.writeFileSync(tmpPath, content, 'utf8')
      let win = new BrowserWindow({
        width: 768,
        height: 1024,
        show: false
      })
      win.loadURL('file://' + tmpPath)
      let contents = win.webContents
      contents.on('did-finish-load', () => {
        contents.printToPDF({}, (error, data) => {
          if (error) throw error
          fs.writeFileSync(filePath, data)
          win.close()
          // 删除HTML文件
          fs.unlinkSync(tmpPath)
        })
      })
    }
  }
  // 获取目录
  static getPath () {
    let path = dialog.showOpenDialog({
      properties: ['createDirectory', 'openDirectory'],
      buttonLabel: '选择'
    })
    return path
  }

  static async dePublish (_id, user) {
    let r = await Blog.dePublish(_id, user)
    return r
  }
}
