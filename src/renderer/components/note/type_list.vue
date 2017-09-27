<template>
    <div>
        <top-head title="分类列表"></top-head>
        <div class="list">
          <mu-list>
            <template v-for="(v, k) in typeMap">
              <mu-list-item :title="k" @click.native="$router.push('/?category=' + k)">
                <mu-badge :content="String(v)" slot="right" primary/>
              </mu-list-item>
              <mu-divider/>
            </template>
          </mu-list>
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
      typeMap: {}
    }
  },
  methods: {
    ...mapActions(['getTypeListMap'])
  },
  async mounted () {
    this.typeMap = await this.getTypeListMap()
  }
}
</script>
