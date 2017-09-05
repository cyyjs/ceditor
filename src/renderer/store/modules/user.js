'use strict'
let token = localStorage.getItem('token')
let user, userID
try {
  user = JSON.parse(localStorage.getItem('user'))
  userID = user.id
} catch (e) {
  user = {}
}
const state = {
  token,
  user,
  userID
}

const mutations = {
  SET_USER (state, data) {
    state.user = data
    localStorage.setItem('user', JSON.stringify(data))
    localStorage.setItem('userID', data.id)
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
