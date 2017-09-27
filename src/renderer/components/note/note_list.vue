<template>
    <div>
      <mu-dialog :open="dialog" title="系统提示" @close="dialog=false" dialogClass="dialogClass">
        {{tip}}
        <mu-flat-button slot="actions" @click="dialog=false" label="取消"/>
        <mu-flat-button slot="actions" primary @click="confimDelete" label="确定"/>
      </mu-dialog>

      <top-head @change="change" title="全部文章" type="note"></top-head>
      <div class="list">
        <div class="month-item" v-for="(v, k) in noteMap" :key="k">
          <div style="padding:5px;">{{k}}</div>
          <mu-grid-list class="noteList" :cols="4" :padding="20" >
            <mu-grid-tile v-for="post in v" :key="post._id" class="note-item" @click.native="$router.push('/post/' + post._id)">
              <span class="tooltip" tooltip="已发布" v-show="post.publish">
                <svg class="icon hexo-item" aria-hidden="true">
                  <use xlink:href="#icon-fe-hexo-w"></use>
                </svg>
              </span>
              <img :src="post.thumbnail ? post.thumbnail : defaultImg"/>
              <span slot="title">{{post.title}}</span>
              <span slot="subTitle"><b>{{post.category}}</b></span>
              <mu-icon-button icon="close" slot="action" @click.native.stop="remove(post)"/>
            </mu-grid-tile>
          </mu-grid-list>
        </div>
      </div>
    </div>
</template>
<script>
import TopHead from './head.vue'
import { mapActions } from 'vuex'
const path = require('path')
export default {
  components: { TopHead },
  data () {
    return {
      _id: '',
      dialog: false,
      tip: '',
      category: '',
      tag: '',
      noteMap: {}
    }
  },
  computed: {
    // ...mapState({
    //   list: ({post}) => post.list
    // }),
    defaultImg () {
      return process.env.NODE_ENV === 'development' ? '../../../src/renderer/assets/img/timg.jpeg' : path.join(__static, 'img/timg.jpeg')
    }
  },
  methods: {
    ...mapActions(['getNoteGroupMonth', 'deleteNote', 'dePublish']),
    remove (post) {
      if (post.publish) {
        this.tip = '该文章已经发布，删除后将会取消发布，确认要删除吗？'
      } else {
        this.tip = '确认要删除吗？'
      }
      this.dialog = true
      this._id = post._id
    },
    async confimDelete () {
      this.dialog = false
      await this.dePublish(this._id)
      await this.deleteNote(this._id)
      this.fetch()
    },
    async fetch () {
      let query = {}
      if (this.category) {
        query.category = this.category
      }
      if (this.tag) {
        query.tags = this.tag
      }
      this.noteMap = await this.getNoteGroupMonth(query)
    },
    async change (opt) {
      this.category = opt.category
      this.tag = opt.tag
      await this.fetch()
    }
  },
  watch: {
    $route () {
      this.category = ''
      this.tag = ''
      this.fetch()
    }
  },
  async mounted () {
    this.category = this.$route.query.category
    this.tag = this.$route.query.tag
    await this.fetch()
  },
  async deactivated () {
    console.log('==')
  }
}
</script>
<style>
.list{
  padding: 15px;
  padding-top: 60px;
}
.hexo-item{
  font-size: 24px;
  position: absolute;
  z-index: 1;
  left: 5px;
  top: 5px;
  background: #ccc;
  border-radius: 30%;
}
.note-item>div:hover {
  box-shadow: 0 3px 10px rgba(0,0,0,.156863), 0 3px 10px rgba(0,0,0,.227451);
}
</style>