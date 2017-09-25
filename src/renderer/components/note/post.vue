<template>
    <div>
      <div class="progress" v-show="loading">
        <mu-circular-progress  :size="40" :strokeWidth="5"/>
      </div>
      <post-head v-model="postMate" @change="saveCom" :note="post" @menu="clickMenu"></post-head>
      <div id="editor" @click="clickEditor">
          <mavon-editor ref="editor" placeholder="在此输入内容..." style="height: 100%" :subfield="false" :toolbars="toolbars" :default_open="defaultOpen" :ishljs="true" v-model="content" @save="save" @imgAdd="imgAdd"></mavon-editor>
      </div>
    </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import { mavonEditor } from 'mavon-editor'
import PostHead from './postHead.vue'
import 'mavon-editor/dist/css/index.css'
const toolbars = require('../../config.json').toolbars
let timer = null
export default {
  components: {
    mavonEditor,
    PostHead
  },
  data () {
    return {
      loading: false,
      _id: null,
      defaultOpen: '',
      content: '',
      toolbars,
      imgFile: {},
      postMate: {
        title: '',
        category: '',
        tags: []
      }
    }
  },
  computed: {
    ...mapState({
      post: ({post}) => post.post
    })
  },
  methods: {
    ...mapActions(['getNote', 'saveOrUpdateNote', 'saveImg', 'exportFile']),
    async init () {
      this._id = this.$route.params.id
      if (this._id) {
        let post = await this.getNote(this._id)
        this.postMate = {
          title: post.title,
          category: post.category,
          tags: post.tags,
          updated: post.updated,
          date: post.date
        }
        this.defaultOpen = 'preview'
        this.content = post.content
      } else {
        this.defaultOpen = 'edit'
        this.postMate = {
          title: '',
          category: '',
          tags: [],
          updated: new Date(),
          date: new Date()
        }
        this.content = ''
      }
    },
    async save () {
      this.loading = true
      let save = async () => {
        await this.saveCom()
        this.loading = false
      }
      setTimeout(() => {
        save()
      }, 500)
    },
    async saveCom () {
      let imgList = []
      for (let k in this.imgFile) {
        imgList.push([k, this.imgFile[k]])
      }
      this.$refs.editor.$imglst2Url(imgList)
      let post = {
        _id: this._id,
        ...this.postMate,
        content: this.content
      }
      let r = await this.saveOrUpdateNote(post)
      if (r) {
        this.postMate.updated = new Date()
        if (r._id) {
          this._id = r._id
          await this.getNote(this._id)
        }
      }
    },
    async imgAdd (pos, file) {
      this.loading = true
      let url = await this.saveImg(file)
      this.imgFile[pos] = url
      this.$refs.editor.$img2Url(pos, url)
      this.loading = false
    },
    clickEditor (event) {
      event.stopPropagation()
      event.preventDefault()
      let ele = event.target
      if (ele.tagName === 'A') {
        let href = ele.getAttribute('href')
        this.$openUrl(href)
      }
    },
    async clickMenu (t) {
      await this.save()
      this.exportFile({
        _id: this._id,
        type: t,
        mk: this.content,
        postMate: this.postMate,
        html: this.$refs.editor.d_render
      })
    }
  },
  watch: {
    async $route () {
      await this.init()
    }
  },
  async mounted () {
    await this.init()
    clearInterval(timer)
    timer = setInterval(() => {
      if (this.$route.path.includes('/post')) {
        this.saveCom()
      } else {
        clearInterval(timer)
      }
    }, 60000)
  }
}
</script>
<style>
#editor {
  position: absolute;
  bottom: 0;
  width: 100%;
  top: 89px;
  right: 0;
  left: 0;
  z-index: -1;
}
.progress{
  position: absolute;
  left: 50%;
  margin-left: -30px;
  top: 10px;
}
</style>