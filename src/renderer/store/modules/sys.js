'use strict'
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
  }
}

export default {
  state,
  mutations,
  actions
}
