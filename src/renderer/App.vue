<template>
  <div id="app">
    <left-nav v-if="$route.path !== '/login'"></left-nav>
    <div :class="mainClass">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import LeftNav from './components/nav/leftNav.vue'
  const {ipcRenderer} = require('electron')
  export default {
    name: 'ceditor',
    components: {
      LeftNav
    },
    computed: {
      ...mapState({
        openNav: ({sys}) => sys.openNav || false
      }),
      mainClass () {
        return this.$route.path !== '/login' && this.openNav ? 'left' : 'main'
      }
    },
    methods: {
      ...mapActions(['setUser', 'setToken'])
    },
    mounted () {
      ipcRenderer.on('logined', (event, data) => {
        this.setUser(data.user)
        this.setToken(data.token)
      })
    }
  }
</script>

<style>
  .main{
    margin-left: 0px;
    transition: all .45s cubic-bezier(.23, 1, 1, 1);
  }
  .left{
    margin-left: 80px;
    transition: all .45s cubic-bezier(.23, 1, 1, 1);
  }
</style>
