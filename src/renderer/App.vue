<template>
  <div id="app">
    <left-nav v-if="$route.path !== '/login'"></left-nav>
    <div :class="mainClass" id="main-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import LeftNav from './components/nav/leftNav.vue'
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
        return this.$route.path !== '/login' && this.openNav ? 'main-right' : 'main'
      }
    },
    methods: {
      ...mapActions(['initNote'])
    },
    async mounted () {
      await this.initNote()
    }
  }
</script>

<style>
  .main{
    margin-left: 0px;
    transition: all .45s cubic-bezier(.23, 1, 1, 1);
  }
  .main-right{
    margin-left: 70px;
    transition: all .45s cubic-bezier(.23, 1, 1, 1);
  }
  #main-right{
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: -2;
  }
</style>
