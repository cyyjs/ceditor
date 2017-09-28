<template>
    <div :class="['top-head', 'drag', type =='note' ? '' :'center']">
        <span class="title">{{title}}</span>
        <div class="right" v-if="type == 'note'">
          <span class="type-icon left">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fenlei"></use>
            </svg>
          </span>
          <multiselect class="select left nodrag" v-model="postType" :show-labels="false" placeholder="选择分类" :options="types" :allow-empty="true" @input="change">
            <span slot="noResult">无结果</span>
          </multiselect>
          <span class="type-icon left ">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-biaoqian"></use>
            </svg>
          </span>
          <multiselect class="select left nodrag" v-model="tag" tag-placeholder="" placeholder="选择标签"  :options="tags" select-label="选择标签"  :show-labels="false" @input="change">
            <span slot="noResult">无结果</span>
          </multiselect>
          <mu-text-field hintText="搜索文章" @input="change" icon="search" class="search nodrag"/>
          <mu-raised-button class="add nodrag" mini label="新建" icon="add" to="/post" primary/>
        </div>
        <slot></slot>
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
  props: {
    type: String,
    title: String
  },
  components: {
    Multiselect
  },
  data () {
    return {
      tag: '',
      postType: ''
    }
  },
  computed: {
    ...mapState({
      types: ({types}) => types.types || [],
      tags: ({tags}) => tags.tags || []
    })
  },
  methods: {
    ...mapActions(['getTypeList', 'getTagList']),
    change (v) {
      this.$emit('change', {
        category: this.postType,
        tag: this.tag,
        title: v
      })
    }
  },
  async mounted () {
    await this.getTypeList()
    await this.getTagList()
    this.postType = this.$route.query.category
    this.tag = this.$route.query.tag
  }
}
</script>
<style lang='scss' scoped>
.top-head{
    position: fixed;
    z-index: 1000;
    left: 70px;
    right: 0;
    top: 0;
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
.select{
  width: 120px;
}
.left{
  float: left;
  margin-top: 10px;
}
.type-icon{
  line-height: 30px;
  margin-right: 10px;
  margin-left: 10px;
}
</style>