<template>
    <div id="login">
        <div class="title">
          <img class="logo" draggable="false" :src="headImg" alt="logo">
        </div>
        <a href="#" @click="$send('oauth')">xx</a>
        <mu-text-field class="input" v-model.trim="email" type="email" hintText="Email"/><br/>
        <mu-text-field class="input" v-model.trim="password" hintText="密码" type="password"/><br/>
        <mu-raised-button label="登录" @click="submit()" class="logbtn" fullWidth primary/>
        <mu-flat-button label="注册" class="reg"/>
        <mu-flat-button label="忘记密码" class="forget" secondary/>
    </div>
</template>

<script>
export default {
  data () {
    return {
      headImg: 'http://ogd60qga4.bkt.clouddn.com/logo.jpeg',
      email: '',
      password: ''
    }
  },
  methods: {
    submit () {
      let msg = ''
      if (!this.email || !this.password) {
        msg = '请输入用户名或密码'
      }
      if (msg) {
        this.$message({
          type: 'warning',
          title: '登录失败',
          message: msg
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
    #login{
      color: #fff;
      overflow: hidden;
      height: 360px;
      background-image: url(~@/assets/img/timg.jpeg);
      padding: 30px;
      padding-top: 0;
      & .title{
        padding-top: 30px;
        text-align: center;
        -webkit-app-region: drag;
      }
      & .logo{
        user-select:none;
        box-shadow: 0 3px 10px rgba(0,0,0,.156863), 0 3px 10px rgba(0,0,0,.227451);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-bottom: 10px;
      }
      & .logbtn{
        margin-bottom: 5px;
      }
      & .forget{
        float: right;
      }
      & .reg{
        color: #fff;
      }
    }
</style>