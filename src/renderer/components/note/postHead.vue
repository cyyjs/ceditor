<template>
  <div>
    <mu-dialog :open="dialog" title="系统提示" @close="dialog=false" dialogClass="dialogClass">
      确认要取消发布么？
      <mu-flat-button slot="actions" @click="dialog=false" label="取消"/>
      <mu-flat-button slot="actions" primary @click="rePublish" label="确定"/>
    </mu-dialog>
    <div class="top-head drag clearfix">
      <input type="text" v-model="post.title" @change="change" placeholder="请输入标题..." class="title">
      <div class="right">
        <template v-if="isLogin">
           <mu-flat-button v-if="note.publish || publishing" style="color:#05bff5;margin-right:-10px;" :disabled="publishing" :label="publishing ? '发布中' : '已发布'" labelPosition="after" @click="dialog=true">
            <mu-icon v-if="publishing" value="settings" class="spin" style="vertical-align: middle;" color="#05bff5"/>
            <svg  v-else class="icon" aria-hidden="true" style="font-size: 24px;margin-left: 10px;margin-right:-10px;">
              <use xlink:href="#icon-fe-hexo"></use>
            </svg>
          </mu-flat-button>
        </template>
        <mu-icon-menu icon="more_vert" slot="right" menuClass="rightMenu">
          <mu-menu-item @click="$emit('menu', 'md')">
            <span slot="title">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-md"></use>
              </svg>
              导出 Markdown
            </span>
          </mu-menu-item>
          <mu-menu-item @click="$emit('menu', 'html')">
            <span slot="title">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-HTML"></use>
              </svg>
              导出 HTML
            </span>
          </mu-menu-item>
          <mu-menu-item @click="$emit('menu', 'pdf')">
            <span slot="title">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-pdf1"></use>
              </svg>
              导出 PDF
            </span>
          </mu-menu-item>
          <template v-if="isLogin">
            <mu-divider />
            <mu-menu-item @click="$emit('menu', 'hexo')" :disabled="publishing">
              <span slot="title">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fe-hexo"></use>
                </svg>
                发布到博客
              </span>
            </mu-menu-item>
          </template>
        </mu-icon-menu>
      </div>
      <div>
        <span class="type-icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fenlei"></use>
          </svg>
        </span>
        <multiselect class="select" @keyup.native="inputChange" v-model="post.category" :show-labels="false" placeholder="选择分类" :options="options" :allow-empty="false" @input="change">
          <span slot="noResult">按Enter键新建</span>
        </multiselect>
        <span class="type-icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-biaoqian"></use>
          </svg>
        </span>
        <multiselect class="tags" v-model="post.tags" tag-placeholder="" placeholder="搜索添加标签" :options="tags" :multiple="true" :max="3" :hide-selected="true" select-label="选择标签" deselect-label="删除标签" :show-labels="false" :limit-text="limitText" :taggable="true" @tag="addTag" @input="change">
          <span slot="noResult">按Enter键新建</span>
          <span slot="maxElements">最多只能选择3个</span>
        </multiselect>
        <span class="time">
          修改时间: {{updated}}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        title: '',
        tags: [],
        category: '',
        updated: new Date()
      })
    },
    note: Object
  },
  components: {
    Multiselect
  },
  data () {
    return {
      dialog: false,
      flag: 1,
      post: (() => {
        return this.value
      })(),
      options: [],
      tags: []
    }
  },
  computed: {
    ...mapState({
      publishing: ({post}) => post.publishing,
      isLogin: ({user}) => user.userID
    }),
    updated () {
      return moment(this.post.updated).format('YYYY-MM-DD HH:mm')
    }
  },
  methods: {
    ...mapActions(['getTypeList', 'getTagList', 'dePublish']),
    inputChange (event) {
      let v = event.target.value
      if (event.keyCode === 13) {
        this.post.category = v
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
      this.$emit('change')
    },
    change () {
      this.emit()
    },
    async rePublish () {
      this.dialog = false
      await this.dePublish(this.note._id)
    }
  },
  watch: {
    value: {
      handler (v) {
        if (this.flag) {
          this.post.category = v.category
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
.top-head {
  border-bottom: 1px solid #ddd;
  background-color: #eee;
  color: #333;
  padding: 0 10px;
}
.rightMenu {
  width: 200px;
  & .icon{
    font-size: 20px;
  }
}
.title {
  margin: 10px;
  outline: none;
  border: none;
  background: none;
  font-size: 1.1rem;
  font-weight: bold;
  width: 80%;
}

.select {
  width: 120px;
  float: left;
  margin-left: 10px;
}

.tags {
  float: left;
  margin-left: 10px;
  width: 300px;
}

.type-icon {
  float: left;
  margin-left: 10px;
  color: #666;
  line-height: 30px;
}

.time {
  color: #666;
  font-size: 0.8rem;
  float: right;
  margin-right: 30px;
}
</style>
