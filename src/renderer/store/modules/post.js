'use strict'
import {PostDB} from '../db'
import UploadAPI from '../../../lib/upload'
import Io from '../../../lib/io'
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const Reg = /!\[[^[]*?\]\(\s*([^)|^\s]+)(?=\s*\))/g
const defaultContent = fs.readFileSync(path.join(__static, 'default.md')).toString()
const state = {
  list: [],
  post: {},
  publishing: false
}

const mutations = {
  SET_NOTE_LIST (state, data) {
    state.list = data
  },
  SET_POST (state, data) {
    state.post = data
  },
  SET_PUBLISHING (state, data) {
    state.publishing = data
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
    let data = await PostDB.findSort(query, { updated: -1 })
    commit('SET_NOTE_LIST', data)
    return data
  },

  // 按月份获取文章列表
  async getNoteGroupMonth ({ commit }, query = {}) {
    let data = await PostDB.findSort(query, { updated: -1 })
    let map = {}
    data.forEach(item => {
      let m = moment(item.updated).format('YYYY-MM')
      map[m] = map[m] || []
      map[m].push(item)
    })
    return map
  },

  // 保存文章
  async saveNote ({commit, dispatch}, post) {
    let user = dispatch('getUser')
    post.userID = user._id
    post.date = new Date()
    post.updated = new Date()
    let img = Reg.exec(post.content)
    if (img && img.length > 0) {
      img = img[1]
      post.thumbnail = img
    }
    let r = await PostDB.insert(post)
    return r
  },

  // 获取某个文章
  async getNote ({commit}, _id) {
    let post = await PostDB.findOne({_id})
    commit('SET_POST', post)
    return post
  },

  // 保存或修改文章
  async saveOrUpdateNote ({commit, dispatch}, post) {
    post.updated = new Date()
    let img = Reg.exec(post.content)
    if (img && img.length > 0) {
      img = img[1]
      post.thumbnail = img
    }
    let r
    if (post._id) {
      r = await PostDB.update({_id: post._id}, {$set: post})
      dispatch('getNote', post._id)
    } else {
      delete post._id
      let user = await dispatch('getUser')
      post.userID = user._id
      post.date = new Date()
      post.publish = false
      r = await PostDB.insert(post)
      dispatch('getNote', r._id)
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
  async exportFile ({commit, dispatch}, data) {
    let user = await dispatch('getUser')
    if (data.type === 'hexo') {
      commit('SET_PUBLISHING', true)
    }
    await Io.export(data, user)
    commit('SET_PUBLISHING', false)
    dispatch('getNote', data._id)
  },

  // 取消发布
  async dePublish ({dispatch}, _id) {
    let user = await dispatch('getUser')
    await Io.dePublish(_id, user)
    dispatch('getNote', _id)
  },
  // 初始化文章
  async initNote ({dispatch}) {
    let count = await PostDB.count({})
    if (!count) {
      let user = dispatch('getUser')
      let data = {
        userID: user._id,
        title: '欢迎使用 CEditor',
        category: '默认分类',
        tags: ['markdown'],
        content: defaultContent,
        date: new Date(),
        publish: false,
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
