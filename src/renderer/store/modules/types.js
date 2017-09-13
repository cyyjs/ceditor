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
    let data = await PostDB.find({}, {type: 1})
    let types = _.uniq(data.map(i => i.type)).filter(i => !!i)
    commit('SET_TYPE_LIST', types)
    return types
  }
}

export default {
  state,
  mutations,
  actions
}
