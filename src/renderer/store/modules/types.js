'use strict'
import {PostDB} from '../db'
import _ from 'lodash'

const state = {
  types: []
}

const mutations = {
  SET_TYPE_LIST (state, data) {
    state.types = data
  }
}

const actions = {
  async getTypeList ({ commit }) {
    // let userID = localStorage.getItem('userID')
    let data = await PostDB.find({}, {category: 1})
    let types = _.uniq(data.map(i => i.category)).filter(i => !!i)
    commit('SET_TYPE_LIST', types)
    return types
  },
  // 类型对应文章个数
  async getTypeListMap ({ commit }) {
    let data = await PostDB.find({}, {category: 1})
    let map = {}
    data.forEach(item => {
      map[item.category] = map[item.category] || 0
      map[item.category]++
    })
    return map
  }
}

export default {
  state,
  mutations,
  actions
}
