'use strict'
import {PostDB} from '../db'
import _ from 'lodash'

const state = {
  tags: []
}

const mutations = {
  SET_TAGS_LIST (state, data) {
    state.tags = data
  }
}

const actions = {
  async getTagList ({ commit }) {
    // let userID = localStorage.getItem('userID')
    let data = await PostDB.find({}, {tags: 1})
    let tags = _.union(...data.map(i => i.tags))
    commit('SET_TAGS_LIST', tags)
    return tags
  },
  async getTagListMap ({ commit }) {
    let data = await PostDB.find({}, {tags: 1})
    let map = {}
    data.forEach(item => {
      item.tags.forEach(t => {
        map[t] = map[t] || 0
        map[t]++
      })
    })
    return map
  }
}

export default {
  state,
  mutations,
  actions
}
