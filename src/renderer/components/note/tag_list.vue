<template>
    <div>
        <top-head title="分类列表"></top-head>
        <div class="list">
          <mu-chip class="chip" backgroundColor="teal500" color="#fff" v-for="tag in tags" :key="tag" @click.native="$router.push('/?tag='+tag)">
            {{tag}}
          </mu-chip>
        </div>
    </div>
</template>
<script>
import TopHead from './head.vue'
import { mapState, mapActions } from 'vuex'
export default {
  components: { TopHead },
  data () {
    return {}
  },
  computed: {
    ...mapState({
      tags: ({tags}) => tags.tags
    })
  },
  methods: {
    ...mapActions(['getTagList'])
  },
  async mounted () {
    await this.getTagList()
  }
}
</script>
<style>
  .list{
    padding: 20px;
  }
  .chip{
    margin: 5px;
  }
</style>