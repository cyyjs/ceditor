'use strict'
import {PostDB} from '../db'
import UploadAPI from '../../../lib/upload'
import Io from '../../../lib/io'
const fs = require('fs')
const path = require('path')
const Reg = /!\[[^[]*?\]\(\s*([^)|^\s]+)(?=\s*\))/g
const defaultContent = fs.readFileSync(path.join(__static, 'default.md')).toString()
const state = {
  list: []
}

const mutations = {
  SET_NOTE_LIST (state, data) {
    state.list = data
  }
}

const actions = {

  // 保存上传图片
  async saveImg ({ commit }, file) {
    let result = await UploadAPI.upload(file)
    return result
  },

  // 获取文章列表
  async getNoteList ({ commit }, query = {}) {
    let data = await PostDB.find(query)
    commit('SET_NOTE_LIST', data)
    return data
  },

  // 保存文章
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

  // 获取某个文章
  async getNote ({commit}, _id) {
    let post = await PostDB.findOne({_id})
    return post
  },

  // 保存或修改文章
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

  // 删除文章
  async deleteNote ({commit, dispatch}, _id) {
    let r = await PostDB.remove({_id})
    dispatch('getNoteList')
    return r
  },

  // 文件导出
  exportFile ({commit}, data) {
    Io.export(data)
  },

  // 初始化文章
  async initNote ({dispatch}) {
    let count = await PostDB.count({})
    if (!count) {
      let userID = localStorage.getItem('userID')
      let data = {
        userID,
        title: '欢迎使用 CEditor',
        type: '默认分类',
        tags: ['markdown'],
        content: defaultContent,
        created: new Date(),
        updated: new Date()
      }
      let r = await PostDB.insert(data)
      dispatch('getNoteList')
      return r
    }
  }
}

export default {
  state,
  mutations,
  actions
}
