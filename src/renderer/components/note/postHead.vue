<template>

    <div class="top-head drag clearfix">
        <input type="text" v-model="post.title" @change="change" placeholder="请输入标题..." class="title">
        <div class="right">
          <mu-icon-menu icon="more_vert" slot="right">
            <mu-menu-item title="菜单 1"/>
            <mu-menu-item title="菜单 2"/>
            <mu-menu-item title="菜单 3"/>
            <mu-menu-item title="菜单 4"/>
            <mu-menu-item title="菜单 5"/>
          </mu-icon-menu>
        </div>
        <div>
          <span class="type-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fenlei"></use>
            </svg>
          </span>
          <multiselect class="select" @keyup.native="inputChange" v-model="post.type" :show-labels="false" placeholder="选择分类" :options="options" :allow-empty="false" @input="change">
            <span slot="noResult">按Enter键新建</span>
          </multiselect>
          <span class="type-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-biaoqian"></use>
            </svg>
          </span>
          <multiselect class="tags" v-model="post.tags" tag-placeholder="" placeholder="搜索添加标签"  :options="tags" :multiple="true" :max="3" :hide-selected="true" select-label="选择标签" deselect-label="删除标签" :show-labels="false" :limit-text="limitText" :taggable="true" @tag="addTag" @input="change">
            <span slot="noResult">按Enter键新建</span>
            <span slot="maxElements">最多只能选择3个</span>
          </multiselect>
          <span class="time">
            修改时间: {{updated}}
          </span>
        </div>
    </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import {mapActions} from 'vuex'
import moment from 'moment'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        title: '',
        tags: [],
        type: '',
        updated: new Date()
      })
    }
  },
  components: {
    Multiselect
  },
  data () {
    return {
      flag: 1,
      post: (() => {
        return this.value
      })(),
      options: [],
      tags: []
    }
  },
  computed: {
    updated () {
      return moment(this.post.updated).format('YYYY-MM-DD HH:mm')
    }
  },
  methods: {
    ...mapActions(['getTypeList', 'getTagList']),
    inputChange (event) {
      let v = event.target.value
      if (event.keyCode === 13) {
        this.post.type = v
        this.options.push(v)
        event.target.blur()
      }
    },
    addTag (t) {
      this.tags.push(t)
      this.post.tags.push(t)
      this.emit()
    },
    limitText (count) {
      return `最多添加${count}个标签`
    },
    emit () {
      this.flag = 0
      this.$emit('input', this.post)
    },
    change () {
      this.emit()
    }
  },
  watch: {
    value: {
      handler (v) {
        if (this.flag) {
          this.post.type = v.type
          this.post.tags = [...v.tags]
          this.post.title = v.title
        }
        this.post.updated = v.updated
      },
      deep: true
    }
  },
  async mounted () {
    let options = await this.getTypeList()
    this.options = [...options]
    let tags = await this.getTagList()
    this.tags = [...tags]
  }
}
</script>
<style lang='scss' scoped>
.top-head{
  border-bottom: 1px solid #ddd;
  background-color: #eee;
  color: #333;
  padding: 0 10px;
}
.title{
  margin: 10px;
  outline: none;
  border: none;
  background: none;
  font-size: 1.1rem;
  font-weight: bold;
  width: 80%;
}
.select{
  width: 120px;
  float: left;
  margin-left: 10px;
}

.tags {
  float: left;
  margin-left: 10px;
  width: 300px;
}
.type-icon{
  float: left;
  margin-left: 10px;
  color: #666;
  line-height: 30px;
}
.time{
  color: #666;
  font-size: 0.8rem;
  float: right;
  margin-right: 30px;
}
</style>