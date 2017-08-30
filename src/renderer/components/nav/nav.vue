<template>
    <div id="nav-top">
        <mu-appbar title="Title">
          <mu-icon-button icon="menu" slot="left"/>
          <mu-flat-button label="expand_more" slot="right"/>
          <mu-icon-button icon="expand_more" slot="right"/>
        </mu-appbar>
    </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    // methodMap
  }
}
</script>

<style lang='scss' scoped>
  #nav-top{
    -webkit-app-region: drag;
  }
</style>