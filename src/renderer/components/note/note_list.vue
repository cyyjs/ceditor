<template>
    <div>
      <top-head @change="change" title="全部文章" type="note"></top-head>
      <div class="list">
        <mu-grid-list class="noteList" :cols="4" :padding="10" >
          <mu-grid-tile v-for="post in list" :key="post._id" @click.native="$router.push('/post/' + post._id)">
            <img :src="post.image ? post.image : defaultImg"/>
            <span slot="title">{{post.title}}</span>
            <span slot="subTitle"><b>{{post.type}}</b></span>
            <mu-icon-button icon="close" slot="action" @click.native.stop="remove(post._id)"/>
          </mu-grid-tile>
        </mu-grid-list>
      </div>
    </div>
</template>
<script>
import TopHead from './head.vue'
import { mapState, mapActions } from 'vuex'
const path = require('path')
export default {
  components: { TopHead },
  data () {
    return {
      type: '',
      tag: ''
    }
  },
  computed: {
    ...mapState({
      list: ({post}) => post.list
    }),
    defaultImg () {
      return process.env.NODE_ENV === 'development' ? '../../../src/renderer/assets/img/timg.jpeg' : path.join(__static, 'img/timg.jpeg')
    }
  },
  methods: {
    ...mapActions(['getNoteList', 'deleteNote']),
    remove (id) {
      this.deleteNote(id)
    },
    async fetch () {
      let query = {}
      if (this.type) {
        query.type = this.type
      }
      if (this.tag) {
        query.tags = this.tag
      }
      await this.getNoteList(query)
    },
    async change (opt) {
      this.type = opt.type
      this.tag = opt.tag
      await this.fetch()
    }
  },
  watch: {
    $route () {
      this.type = ''
      this.tag = ''
      this.fetch()
    }
  },
  async mounted () {
    this.type = this.$route.query.type
    this.tag = this.$route.query.tag
    await this.fetch()
  }
}
</script>
<style>
.list{
  padding: 10px;
}
</style>