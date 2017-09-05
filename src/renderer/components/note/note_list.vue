<template>
    <div>
      <top-head title="全部文章" type="note"></top-head>
        <div class="list">
          <mu-grid-list class="noteList" :cols="4" :padding="10" >
            <mu-grid-tile v-for="post in list" :key="post._id" @click.native="$router.push('/post/' + post._id)">
              <img :src="post.image ? post.image : defaultImg"/>
              <span slot="title">{{post.title}}</span>
              <span slot="subTitle">by <b>{{post.author}}</b></span>
              <mu-icon-button icon="close" slot="action" @click.native="deleteNote(post._id)"/>
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
      defaultImg: path.join(__dirname, '../../assets/img/timg.jpeg')
    }
  },
  computed: {
    ...mapState({
      list: ({post}) => post.list
    })
  },
  methods: {
    ...mapActions(['getNoteList', 'deleteNote'])
  },
  async mounted () {
    await this.getNoteList()
  }
}
</script>
<style>
.list{
  padding: 10px;
}
</style>