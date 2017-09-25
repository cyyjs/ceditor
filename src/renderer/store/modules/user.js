'use strict'
import {UserDB} from '../db'
let token = localStorage.getItem('token')
let user, userID
try {
  user = JSON.parse(localStorage.getItem('user'))
  userID = user._id
} catch (e) {
  user = {}
  userID = ''
}
const state = {
  token,
  user,
  userID
}
// id: data.id,
// name: data.name,
// avatarUrl: data.avatar_url,
// blog: data.blog,
// email: data.email,
// location: data.location,
// bio: data.bio,
// githubAccount: data.login
// blogPath

const mutations = {
  SET_USER (state, data) {
    state.user = data
    state.userID = data._id
    localStorage.setItem('user', JSON.stringify(data))
    localStorage.setItem('userID', data._id)
  },
  SET_TOKEN (state, token) {
    state.token = token
    localStorage.setItem('token', token)
  }
}

const actions = {
  async updateUser ({ dispatch, commit, state }, data) {
    let _id = state.userID
    await UserDB.update({ _id }, { $set: data })
    let user = await UserDB.findOne({ _id })
    if (user) {
      commit('SET_USER', user)
    }
  },
  getUser ({ state }) {
    return state.user
  },
  getUserID ({ state }) {
    return state.userID
  },
  async setUser ({ commit }, data) {
    let _id = data.id
    delete data.id
    data._id = _id
    await UserDB.update({ _id }, data, { upsert: true })
    let user = await UserDB.findOne({ _id })
    if (user) {
      commit('SET_USER', user)
    }
  },
  setToken ({ commit }, data) {
    commit('SET_TOKEN', data)
  },
  logOut ({ commit }) {
    commit('SET_USER', {})
    commit('SET_TOKEN', '')
  }
}

export default {
  state,
  mutations,
  actions
}
