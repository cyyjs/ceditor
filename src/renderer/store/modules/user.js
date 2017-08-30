'use strict'
let token = localStorage.getItem('token')
let user
try {
  user = JSON.parse(localStorage.getItem('user'))
} catch (e) {
  user = {}
}
const state = {
  token,
  user
}

const mutations = {
  SET_USER (state, data) {
    state.user = data
    localStorage.setItem('user', JSON.stringify(data))
  },
  SET_TOKEN (state, token) {
    state.token = token
    localStorage.setItem('token', token)
  }
}

const actions = {
  setUser ({ commit }, data) {
    commit('SET_USER', data)
  },
  setToken ({ commit }, data) {
    commit('SET_TOKEN', data)
  }
}

export default {
  state,
  mutations,
  actions
}
