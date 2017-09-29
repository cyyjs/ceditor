'use strict'
import util from '../assets/js/util'
const path = require('path')
const Datastore = require('nedb')
const userPath = require('electron').remote.app.getPath('userData')
function getDb (name) {
  let db = new Datastore({filename: path.join(userPath, name + '.db'), autoload: true})
  db._find = db.find
  let methods = [ 'find', 'findOne', 'insert', 'count', 'update', 'remove', 'sort' ]
  methods.forEach(item => {
    db[item] = util.promisify(db[item])
  })
  db.findSort = function (query, sort) {
    return new Promise(function (resolve, reject) {
      db._find(query).sort(sort).exec(function (err, docs) {
        if (err) {
          return reject(err)
        } else {
          return resolve(docs)
        }
      })
    })
  }
  return db
}
let PostDB = getDb('post')
let TypeDB = getDb('type')
let TagsDB = getDb('tags')
let UserDB = getDb('user')
let DB = function (name) {
  return new Datastore({filename: path.join(userPath, name + '.db'), autoload: true})
}
export {
  PostDB,
  TypeDB,
  TagsDB,
  UserDB,
  DB
}
// PostDB.remove({}, { multi: true }).then(a => {
//   console.log(a)
// })
