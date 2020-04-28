// 组件内有相同的代码可以使用 ———— 混入
// 可以合并生命周期函数 methods 出现相同的方法会被覆盖
import { debounce } from '@/common/utils'
import BackTop from '@/components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemListener: null,
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 200)
    // 监听【事件总线】的图片加载
    // 对我们监听的事件进行保存
    this.itemListener = () => {
      this.newRefresh()
    };
    this.$bus.$on('itemImageLoad', this.itemListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTop() {
      this.$ref.scroll.scrollTo(0, 0, 300)
    }
  }
}
