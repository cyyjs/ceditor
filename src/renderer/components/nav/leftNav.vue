<template>
    <div id="left-nav">
        <mu-drawer :open="open" class="left-nav drag" :width="70">
          <mu-list>
            <mu-list-item @click.native="$router.push('/setting')"><img :src="headUrl" class="headImg" draggable="false"></mu-list-item>
            <mu-list-item @click.native="$router.push('/')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-biji"></use>
              </svg>
            </mu-list-item>
            <mu-list-item @click.native="$router.push('/type')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fenlei"></use>
              </svg>
            </mu-list-item>
            <mu-list-item @click.native="$router.push('/tags')">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-biaoqian"></use>
              </svg>
            </mu-list-item>
          </mu-list>
        </mu-drawer>
        <mu-icon-button icon="add" class="setting close" to="/post"/>
        <!-- <mu-icon-button icon="close" class="setting close" v-if="open" @click.native="openNav(!open)"/> -->
        <!-- <mu-float-button v-else icon="menu" mini class="setting" @click.native="openNav(!open)"/> -->
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      user: ({user}) => user.user || {},
      open: ({sys}) => sys.openNav || false
    }),
    headUrl () {
      return this.user.avatarUrl || 'http://ogd60qga4.bkt.clouddn.com/logo.jpeg'
    }
  },
  methods: {
    ...mapActions(['openNav'])
  }
}
</script>
<style scoped>
  .headImg{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
  }
  .setting{
    position: fixed;
    bottom: 11px;
    left: 11px;
    z-index: 10;
    color: #fff;
    padding: 8px;
  }
  .left-nav{
    background: #009688;
  }
</style>