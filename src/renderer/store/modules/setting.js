'use strict'
import Io from '../../../lib/io'
import Blog from '../../../lib/blog'
const state = {
  isReady: false,
  initLoading: false
}

const mutations = {
  SET_REDAY (state, ready) {
    state.isReady = ready
  },
  SET_INIT_LOAGING (state, f) {
    state.initLoading = f
  }
}

const actions = {
  async saveBlogPath ({ commit, dispatch }) {
    let path = Io.getPath()
    if (path && path[0]) {
      dispatch('updateUser', {blogPath: path && path[0]})
      commit('SET_INIT_LOAGING', true)
      let user = await dispatch('getUser')
      // 初始化博客目录
      await Blog.initBlog(path[0], user)
      commit('SET_INIT_LOAGING', false)
    }
  },
  getBlogIsReady ({commit}) {
    commit('SET_REDAY', Blog.isReady())
  },
  async saveSetting ({ dispatch }, data) {
    dispatch('updateUser', data)
  }
}

export default {
  state,
  mutations,
  actions
}
