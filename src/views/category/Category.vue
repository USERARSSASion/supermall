<template>
  <NavBar class="cate-nav"><div slot="center">商品分类</div></NavBar>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar'

export default {
  name: 'Category',
  data() {
    return {
      scroll: null
    }
  },
  components: {
    NavBar
  },
  mounted() {
  }
}
</script>

<style scoped>
.cate-nav {
  background-color: var(--color-tint);
}
</style>
