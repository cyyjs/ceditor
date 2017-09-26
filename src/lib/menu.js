'use strict'
import { app, Menu, shell } from 'electron'
let appName = app.getName()
const template = [
  {
    id: 2,
    label: '修改',
    submenu: [
      {label: '撤销', enabled: false, role: 'undo'},
      {label: '重做', role: 'redo'},
      {type: 'separator'},
      {label: '剪切', role: 'cut'},
      {label: '复制', role: 'copy'},
      {label: '粘贴', role: 'paste'},
      {label: '粘贴并匹配样式', role: 'pasteandmatchstyle'},
      {label: '删除', role: 'delete'},
      {label: '全选', role: 'selectall'}
    ]
  },
  {
    label: '视图',
    id: 3,
    enabled: false,
    submenu: [
      {label: '实际大小', role: 'resetzoom'},
      {label: '放大', role: 'zoomin'},
      {label: '缩小', role: 'zoomout'},
      {type: 'separator'},
      {label: '进入全屏', role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    label: '窗口',
    id: 4,
    submenu: [
      {label: '最小化', role: 'minimize'}
    ]
  },
  {
    role: 'help',
    label: '帮助',
    id: 5,
    submenu: [
      {
        label: '关于作者',
        click () {
          shell.openExternal('http://cuiyy.top')
        }
      },
      {
        label: '反馈建议',
        click () {
          shell.openExternal('https://github.com/cyy0418/ceditor/issues')
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: appName,
    id: 1,
    submenu: [
      {label: '关于 ' + app.getName(), role: 'about'},
      {type: 'separator'},
      // {
      //   label: '偏好设置',
      //   accelerator: 'CmdOrCtrl+,',
      //   click: function () {}
      // },
      {type: 'separator'},
      {label: '服务', role: 'services', submenu: []},
      // {type: 'separator'},
      // {id: 'github_login', label: 'GitHub 登录'},
      {type: 'separator'},
      {label: '隐藏 ' + appName, role: 'hide'},
      {label: '隐藏其他', role: 'hideothers'},
      {label: '显示全部', role: 'unhide'},
      {type: 'separator'},
      {label: '退出 ' + appName, role: 'quit'}
    ]
  })

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: '语音',
      submenu: [
        {label: '开始讲话', role: 'startspeaking'},
        {label: '停止讲话', role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {label: '最小化', role: 'minimize'},
    {label: '缩放', role: 'zoom'}
  ]
}
const menu = Menu.buildFromTemplate(template)
let menusMap = {} // 菜单ID对应 MenuItem
app.on('ready', () => {
  Menu.setApplicationMenu(menu)
  let menus = Menu.getApplicationMenu()
  let items = menus.items
  items.forEach(item => {
    menusMap[item.id] = item
  })
})

function enabledMenu (ids, isEnabled) {
  ids.forEach(id => {
    menusMap[id].visible = isEnabled
    // console.log(menusMap[id])
  })
}

export default class {
  static showDefault () {
    enabledMenu([2, 3, 4], false)
  }
  static showEditor () {
    enabledMenu([2, 3, 4], true)
  }
};
