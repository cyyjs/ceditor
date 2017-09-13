'use strict'
import {PostDB} from '../db'
import UploadAPI from '../../../lib/upload'
const fs = require('fs')
const path = require('path')
const Reg = /!\[[^[]*?\]\(\s*([^)|^\s]+)(?=\s*\))/g

const state = {
  list: []
}

const mutations = {
  SET_NOTE_LIST (state, data) {
    state.list = data
  }
}

const actions = {
  async saveImg ({ commit }, file) {
    let result = await UploadAPI.upload(file)
    return result
  },
  async getNoteList ({ commit }, query = {}) {
    let data = await PostDB.find(query)
    commit('SET_NOTE_LIST', data)
    return data
  },
  async saveNote ({commit, dispatch}, post) {
    let userID = localStorage.getItem('userID')
    post.userID = userID
    post.created = new Date()
    post.updated = new Date()
    let img = Reg.exec(post.content)
    if (img && img.length > 0) {
      img = img[1]
      post.image = img
    }
    let r = await PostDB.insert(post)
    return r
  },

  async getNote ({commit}, _id) {
    let post = await PostDB.findOne({_id})
    return post
  },

  async saveOrUpdateNote ({commit, dispatch}, post) {
    post.updated = new Date()
    let img = Reg.exec(post.content)
    if (img && img.length > 0) {
      img = img[1]
      post.image = img
    }
    let r
    if (post._id) {
      r = await PostDB.update({_id: post._id}, {$set: post})
    } else {
      delete post._id
      let userID = localStorage.getItem('userID')
      post.userID = userID
      post.created = new Date()
      r = await PostDB.insert(post)
    }
    return r
  },

  async deleteNote ({commit, dispatch}, _id) {
    let r = await PostDB.remove({_id})
    dispatch('getNoteList')
    return r
  },

  async initNote ({dispatch}) {
    let count = await PostDB.count({})
    if (!count) {
      let userID = localStorage.getItem('userID')
      let data = {
        userID,
        title: '欢迎使用 CEditor',
        type: '默认分类',
        tags: ['markdown'],
        content: fs.readFileSync(path.join(__filename, '../../default.md')).toString(),
        created: new Date(),
        updated: new Date()
      }
      let r = await PostDB.insert(data)
      return r
    }
  }
}

export default {
  state,
  mutations,
  actions
}
