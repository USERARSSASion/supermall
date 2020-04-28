<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <!-- 必须要有固定的高度 -->
    <scroll class="content" :probe-type="3" ref="scroll" @scroll="contentScroll">
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :paramInfo="paramInfo"/>
      <detail-comment-info ref="commen" :commentInfo="commentInfo"/>
      <good-list ref="recommend" :goods="recommends"/>
    </scroll>

    <detail-bottom-bar @addCart="addToCart"/>
    <!-- 监听组件的原生时间要加 .native 修饰符 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <toast :message="message" :show="show"/>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import GoodList from '@/components/content/goods/GoodList'
import Scroll from '@/components/common/scroll/Scroll'
import Toast from '@/components/common/toast/Toast'

import { getDetail, getRecommend, Goods, Shop, GoodsParam } from '@/network/detail'
import { debounce } from '@/common/utils'
import { itemListenerMixin, backTopMixin } from '@/common/mixin'

import { mapActions } from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailBottomBar,
    DetailCommentInfo,
    GoodList,
    Scroll,
    Toast
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopY: [],
      currentIndex: 0,
      message: '',
      show: false
    }
  },
  created() {
    this.iid = this.$route.query.iid
    this.getDetailInfo()
    this.getRecommentInfo()
  },
  mounted() {
    // const refresh = debounce(this.$refs.scroll.refresh, 200)
    // // 监听【事件总线】的图片加载
    // // 对我们监听的事件进行保存
    // this.itemListener = () => {
    //   refresh()
    // };
    // this.$bus.$on('itemImageLoad', this.itemListener)
  },
  destroyed() {
    // 取消事件总线的监听
    this.$bus.$off('itemImageLoad', this.itemListener)
  },
  methods: {
    ...mapActions(['addCart']),
    async getDetailInfo() {
      const info = await getDetail(this.iid);
      const data = info.result;
      this.topImages = data.itemInfo.topImages

      // 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 创建店铺信息
      this.shop = new Shop(data.shopInfo)

      // 保存商品的详情数据
      this.detailInfo = data.detailInfo

      // 获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    },
    async getRecommentInfo() {
      const info = await getRecommend();
      this.recommends = info.data.list

      // this.$nextTick(() => {
      //   this.themeTopY.push(0)
      //   this.themeTopY.push(this.$refs.param.$el.offsetTop - 44)
      //   this.themeTopY.push(this.$refs.commen.$el.offsetTop - 44)
      //   this.themeTopY.push(this.$refs.recommend.$el.offsetTop - 44)
      //   console.log(this.themeTopY)
      // })
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    contentScroll(position) {
      const positionY = -position.y
      // 判断 BackTop 是否显示
      if (positionY >= 1000) {
        this.isShowBackTop = true
      }
      if (positionY < 1000) {
        this.isShowBackTop = false
      }

      const length = this.themeTopY.length
      for (let i = 0; i < length - 1; i++) {
        // if (this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopY[i] && positionY < this.themeTopY[i + 1]) || (i === length - 1 && positionY >= this.themeTopY[i])) {
        //   this.currentIndex = i
        //   console.log(this.currentIndex, i)
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
        if (this.currentIndex !== i && (positionY >= this.themeTopY[i] && positionY < this.themeTopY[i + 1])) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
    imageLoad() {
      this.newRefresh()
      // this.$refs.scroll.refresh()
      this.themeTopY.push(0)
      this.themeTopY.push(this.$refs.param.$el.offsetTop - 44)
      this.themeTopY.push(this.$refs.commen.$el.offsetTop - 44)
      this.themeTopY.push(this.$refs.recommend.$el.offsetTop - 44)
      this.themeTopY.push(Number.MAX_VALUE)
      // console.log(this.themeTopY)
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopY[index], 200)
    },
    async addToCart() {
      // 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 将商品加到购物车
      // const res = await this.$store.dispatch('addCart', product)
      const res = await this.addCart(product)
      // this.show = true
      // this.message = res

      // setTimeout(() => {
      // this.show = false
      // this.message = ''
      // }, 900 )
      this.$toast.show(res, 1000)
    }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px - 60px);
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 10;
    background-color: #fff;
  }
</style>
