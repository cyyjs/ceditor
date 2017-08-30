import { BrowserWindow } from 'electron'
function loginWin () {
  let win = new BrowserWindow({
    height: 360,
    useContentSize: true,
    titleBarStyle: 'hidden',
    resizable: false,
    maximizable: false,
    title: '登录',
    width: 300
  })
  win.loadURL(__winurl + '#login')
  win.on('focus', () => {
    win.setMenu(null)
  })

  return win
}
export default loginWin
