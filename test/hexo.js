var shell = require('shelljs')
// if (!shell.which('hexo')) {
//   shell.echo('Sorry, this script requires git')
//   shell.exit(1)
// }
shell.ls('*.txt').forEach(function (f) {
  console.log(f)
  // var str = shell.cat(file);
  // console.log(str.toString())
})
// shell.mv('a.txt', 'b.txt')
var pathEnv = process.env.path || process.env.Path || process.env.PATH
console.log(pathEnv)