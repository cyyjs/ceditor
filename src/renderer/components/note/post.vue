<template>
    <div>
      <post-head v-model="postMate"></post-head>
      <div id="editor">
          <mavon-editor placeholder="在此输入内容..." style="height: 100%" :subfield="false" :toolbars="toolbars" :default_open="defaultOpen" :ishljs="true" v-model="content" @save="save" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
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
      defaultOpen: '',
      content: '',
      toolbars,
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
    ...mapActions(['getNote', 'saveOrUpdateNote']),
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
      let post = {
        _id: this.$route.params.id || null,
        ...this.postMate,
        content: this.content
      }
      let r = await this.saveOrUpdateNote(post)
      if (r) {
        this.postMate.updated = new Date()
      }
    },
    imgAdd (pos, file) {
      console.log(pos, file)
    },
    imgDel (pos) {
      console.log(pos)
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
</style>