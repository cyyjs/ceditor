const fs = require('fs')
const Path = require('path')
let yml = fs.readFileSync(Path.join(__static, '_config.yml'), 'utf8')
let def = fs.readFileSync(Path.join(__static, 'default.md'), 'utf8')
let hello = fs.readFileSync(Path.join(__static, 'hello_ceditor.md'), 'utf8')
let css = fs.readFileSync(Path.join(__static, 'md.css'), 'utf8')
export {
  yml,
  def,
  hello,
  css
}
