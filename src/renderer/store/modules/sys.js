'use strict'
import { ipcRenderer } from 'electron'
const state = {
  openNav: true
}

const mutations = {
  OPEN_NAV (state, flag) {
    state.openNav = flag
  }
}

const actions = {
  openNav ({ commit }, flag) {
    commit('OPEN_NAV', flag)
  },
  sendMessage ({ commit }, opt) {
    ipcRenderer.send('message', opt)
  }
}

export default {
  state,
  mutations,
  actions
}
