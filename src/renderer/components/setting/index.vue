<template>
    <div>
    <top-head title="个人设置">
        <mu-flat-button v-if="user.id" label="退出登录" class="logout" @click="logout" icon="exit_to_app" secondary/>
    </top-head>
     <div class="head">
        <img class="headImg" draggable="false" :src="headUrl" alt="head">
        <div class="name">{{user.name}}</div>
        <div class="blog"><a href="javascript:;"  @click="goBlog">{{user.blog}}</a></div>
        <div>{{user.bio}}</div>
        <mu-raised-button v-if="!user.id" class="login"  :disabled="loading" label="登录" primary @click="login">
          <mu-icon value="autorenew" v-if="!user.id && loading" class="spin"/>
          <svg class="icon" v-else aria-hidden="true" style="font-size:22px;margin-left:10px;">
            <use xlink:href="#icon-github"></use>
          </svg>
        </mu-raised-button>
     </div>
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import TopHead from '../note/head.vue'
const {ipcRenderer} = require('electron')

export default {
  components: { TopHead },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      user: ({user}) => user.user
    }),
    headUrl () {
      return this.user.avatarUrl || 'http://ogd60qga4.bkt.clouddn.com/logo.jpeg'
    }
  },
  methods: {
    ...mapActions(['logOut', 'setUser', 'setToken']),
    goBlog () {
      this.$openUrl('http://' + this.user.blog)
    },
    logout () {
      this.logOut()
    },
    login () {
      this.loading = true
      this.$send('oauth')
    }
  },
  mounted () {
    ipcRenderer.on('logined', (event, data) => {
      this.setUser(data.user)
      this.setToken(data.token)
      this.loading = false
    })
    ipcRenderer.on('loginClose', (event) => {
      this.loading = false
    })
  }
}
</script>
<style lang='scss' scoped>
  .logout{
    float: right;
    margin-top: 5px;
    margin-left: -120px;
  }
  .headImg{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    box-shadow: 0 14px 45px rgba(0,0,0,.247059), 0 10px 18px rgba(0,0,0,.219608);
  }
  .name{
    font-size: 1.2rem;
    font-weight: bold;
  }
  .head{
    text-align: center;
    margin: 20px;
  }
  .blog{
    margin: 10px 0;
    &>a{
      color: #333;
    }
  }
  .login {
    margin-top: 20px;
    width: 120px;
  }
</style>