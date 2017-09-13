<template>
    <div>
        <top-head title="分类列表"></top-head>
        <div class="list">
          <mu-list>
            <template v-for="item in types">
              <mu-list-item :title="item" @click.native="$router.push('/?type=' + item)"/>
              <mu-divider/>
            </template>
          </mu-list>
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
      types: ({types}) => types.types
    })
  },
  methods: {
    ...mapActions(['getTypeList'])
  },
  async mounted () {
    await this.getTypeList()
  }
}
</script>
<style>
  .list{
    padding: 20px;
  }
</style>