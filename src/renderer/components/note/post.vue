<template>
    <div>
      <div class="progress" v-show="loading">
        <mu-circular-progress  :size="60" :strokeWidth="5"/>
      </div>
      <post-head v-model="postMate"></post-head>
      <div id="editor" @click="clickEditor">
          <mavon-editor ref="editor" placeholder="在此输入内容..." style="height: 100%" :subfield="false" :toolbars="toolbars" :default_open="defaultOpen" :ishljs="true" v-model="content" @save="save" @imgAdd="imgAdd"></mavon-editor>
      </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
import { mavonEditor } from 'mavon-editor'
import PostHead from './postHead.vue'
import 'mavon-editor/dist/css/index.css'
const toolbars = require('../../config.json').toolbars
export default {
  components: {
    mavonEditor,
    PostHead
  },
  data () {
    return {
      loading: false,
      defaultOpen: '',
      content: '',
      toolbars,
      imgFile: {},
      postMate: {
        title: '',
        type: '',
        tags: []
      }
    }
  },
  computed: {

  },
  methods: {
    ...mapActions(['getNote', 'saveOrUpdateNote', 'saveImg']),
    async init () {
      let id = this.$route.params.id
      if (id) {
        let post = await this.getNote(id)
        this.postMate = {
          title: post.title,
          type: post.type,
          tags: post.tags,
          updated: post.updated
        }
        this.defaultOpen = 'preview'
        this.content = post.content
      } else {
        this.defaultOpen = 'edit'
        this.postMate = {
          title: '',
          type: '',
          tags: [],
          updated: new Date()
        }
        this.content = ''
      }
    },
    async save () {
      this.loading = true
      let imgList = []
      for (let k in this.imgFile) {
        imgList.push([k, this.imgFile[k]])
      }
      this.$refs.editor.$imglst2Url(imgList)
      let save = async () => {
        let post = {
          _id: this.$route.params.id || null,
          ...this.postMate,
          content: this.content
        }
        let r = await this.saveOrUpdateNote(post)
        if (r) {
          this.postMate.updated = new Date()
        }
        this.loading = false
      }
      setTimeout(() => {
        save()
      }, 500)
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
    }
  },
  watch: {
    async $route () {
      await this.init()
    }
  },
  async mounted () {
    await this.init()
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