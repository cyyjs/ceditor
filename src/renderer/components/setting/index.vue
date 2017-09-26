<template>
    <div>
    <top-head title="个人设置">
        <mu-flat-button v-if="user._id" label="退出登录" class="logout" @click="logout" icon="exit_to_app" secondary/>
    </top-head>
    <div class="head">
        <img class="headImg" draggable="false" :src="headUrl" alt="head">
        <div class="name">{{user.name}}</div>
        <div class="blog"><a href="javascript:;"  @click="goBlog">{{user.blog}}</a></div>
        <div>{{user.bio}}</div>
        <mu-raised-button v-if="!user._id" class="login"  :disabled="loading" label="登录" primary @click="login">
          <mu-icon value="autorenew" v-if="!user._id && loading" class="spin"/>
          <svg class="icon" v-else aria-hidden="true" style="font-size:22px;margin-left:10px;">
            <use xlink:href="#icon-github"></use>
          </svg>
        </mu-raised-button>
     </div>
     <div class="hexo" v-show="user._id">
        <div style="border-bottom: 1px solid #ddd; padding-bottom: 10px;margin-bottom: 10px;">
          <svg class="icon" aria-hidden="true" style="font-size:2rem;">
            <use xlink:href="#icon-fe-hexo"></use>
          </svg>
          <span style="font-size:1.5rem;">Hexo 设置</span>
        </div>
        <div v-if="!isReady" style="margin-top:10px;">
          请先安装<a href="javascript:;" @click="$openUrl('http://nodejs.org/')">Node.js</a>和
          <a href="javascript:;" @click="$openUrl('http://git-scm.com/')">Git</a>.
        </div>
          
        <div v-else>
          <svg class="icon" aria-hidden="true" style="font-size:1.5rem;color:#666;vertical-align:middle;">
            <use xlink:href="#icon-blog"></use>
          </svg>
          <span class="path"><label for="">博客根目录</label>{{user.blogPath}}</span>
          <span  v-if="initLoading" style="display: inline-block;line-height: 40px;">
            <mu-icon value="settings" class="spin" style="vertical-align: middle;margin-left:10px;" color="#009688"/>
            <span style="color:#009688;">初始化中</span>
          </span>
          <mu-flat-button  v-else :label="user.blogPath ? '重新选择':'选择目录'" icon="folder" class="selectBtn" primary @click.native="saveBlogPath" />
        </div>
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
      user: ({user}) => user.user,
      isReady: ({setting}) => setting.isReady,
      initLoading: ({setting}) => setting.initLoading
    }),
    headUrl () {
      return this.user.avatarUrl || 'http://ogd60qga4.bkt.clouddn.com/logo.jpeg'
    }
  },
  methods: {
    ...mapActions(['logOut', 'setUser', 'setToken', 'saveBlogPath', 'getBlogIsReady']),
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
    this.getBlogIsReady()
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
  .hexo{
    padding: 20px 60px;
  }
  .path{
    vertical-align: bottom;
    line-height: 40px;
    display: inline-block;
    &>label{
      margin-right: 10px;
    }
  }
  .selectBtn {
    line-height: 40px;
    vertical-align: middle;
    height:40px;
  }
</style>