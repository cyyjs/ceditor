<template>
    <div :class="['top-head', 'drag', type =='note' ? '' :'center']">
        <span class="title">{{title}}</span>
        <div class="right" v-if="type == 'note'">
          <mu-text-field hintText="搜索文章" icon="search" class="search"/>
          <mu-raised-button class="add" mini label="新建" icon="add" to="/post" primary/>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    type: String,
    title: String
  },
  data () {
    return {}
  }
}
</script>
<style lang='scss' scoped>
.top-head{
    border-bottom: 1px solid #ddd;
    background-color: #eee;
    color: #333;
    padding: 0 10px;
    & .title{
      font-weight: bold;
      font-size: 1.2rem;
      padding: 10px;
      display: inline-block;
    }
    & .search{
      margin-bottom: 0;
    }
}
.add{
  height: 35px;
  vertical-align: middle;
  margin-left: 10px;
}
</style>