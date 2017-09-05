'use strict'
import util from '../assets/js/util'
const path = require('path')
const Datastore = require('nedb')
const userPath = require('electron').remote.app.getPath('userData')
function getDb (name) {
  let db = new Datastore({filename: path.join(userPath, name + '.db'), autoload: true})
  let methods = [ 'find', 'findOne', 'insert', 'count', 'update', 'remove' ]
  methods.forEach(item => {
    db[item] = util.promisify(db[item])
  })
  return db
}
let PostDB = getDb('post')
let TypeDB = getDb('type')
let TagsDB = getDb('tags')

export {
  PostDB,
  TypeDB,
  TagsDB
}
