<template>
    <div>
        <top-head title="标签列表"></top-head>
        <div class="list">
          <mu-chip class="chip" backgroundColor="teal500" color="#fff" v-for="(v, k) in tagMap" :key="k" @click.native="$router.push('/?tag='+k)">
            {{k}}
            <mu-badge :content="String(v)" class="icon-badge" circle/>
          </mu-chip>
        </div>
    </div>
</template>
<script>
import TopHead from './head.vue'
import { mapActions } from 'vuex'
export default {
  components: { TopHead },
  data () {
    return {
      tagMap: {}
    }
  },
  methods: {
    ...mapActions(['getTagListMap'])
  },
  async mounted () {
    this.tagMap = await this.getTagListMap()
  }
}
</script>
<style>
  .chip{
    margin: 8px;
  }
  .icon-badge>em{
    background-color: #28a599;
    margin-left: 10px;
    margin-right: -5px;
  }
</style>