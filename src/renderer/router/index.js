import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const login = require('@/components/login')
const noteList = require('@/components/note/note_list')
const typeList = require('@/components/note/type_list')
const tagList = require('@/components/note/tag_list')
const post = require('@/components/note/post')
const setting = require('@/components/setting')

export default new Router({
  routes: [
    {
      path: '/login',
      component: login
    }, {
      path: '/',
      component: noteList
    }, {
      path: '/type',
      component: typeList
    }, {
      path: '/tags',
      component: tagList
    }, {
      path: '/post/:id?',
      component: post
    }, {
      path: '/setting',
      component: setting
    }, {
      path: '*',
      redirect: '/'
    }
  ]
})
