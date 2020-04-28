<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      ref="tabControl1"
      :titles="titles"
      class="tab-control"
      v-show="isTabFixed"
      @tabClick='tabClick'/>

    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true"  @pullingUp='loadMore' @scroll="contentScroll">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recommend-view :recommends="recommends"/>
      <home-feature-view/>
      <tab-control
        ref="tabControl2"
        :titles="titles"
        @tabClick='tabClick'/>
      <good-list :goods="showGoods"/>
    </scroll>

    <!-- 监听组件的原生时间要加 .native 修饰符 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import HomeRecommendView from './childComps/HomeRecommendView'
import HomeFeatureView from './childComps/HomeFeatureView'

import NavBar from '@/components/common/navbar/NavBar'
import Scroll from '@/components/common/scroll/Scroll'
import TabControl from '@/components/content/tabControl/TabControl'
import GoodList from '@/components/content/goods/GoodList'
import BackTop from '@/components/content/backTop/BackTop'

import { getHomeMultiData, getHomeGoods } from '@/network/home'
import { debounce } from '@/common/utils'
import { itemListenerMixin, backTopMixin } from '@/common/mixin'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    HomeRecommendView,
    HomeFeatureView,
    TabControl,
    GoodList,
    BackTop,
    NavBar,
    Scroll
  },
  data() {
    return {
      banners: [],
      recommends: [],
      titles: ['流行', '新款', '精选'],
      titleKey: ['pop', 'new', 'sell'],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] }
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  mixins: [itemListenerMixin, backTopMixin],
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    this.getHomeMultiData()
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
  },
  methods: {
    // 事件监听相关方法
    tabClick(index) {
      this.currentType = this.titleKey[index];
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    activated() {
      console.log(this.saveY, '活跃')
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      // 取消事件总线的监听
      this.$bus.$off('itemImageLoad', this.itemListener)
      console.log(this.saveY, '补 活跃')
    },
    contentScroll(position) {
      // 判断 BackTop 是否显示
      if (position.y < -1000) {
        this.isShowBackTop = true
      } else {
        this.isShowBackTop = false
      }

      // 决定 tabControl 是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // 所有组件都有一个属性 $el: 用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    // 网络请求相关方法
    async getHomeMultiData() {
      const homeData = await getHomeMultiData();
      this.banners = homeData.data.banner.list;
      this.recommends = homeData.data.recommend.list;
    },
    async getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      // 请求商品数据
      const goodsData = await getHomeGoods(type, page);
      this.goods[type].list.push(...goodsData.data.list)
      this.goods[type].page ++;

      // 完成上来加载更多
      this.$refs.scroll.finishPullUp()
    }
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    color: white;
    background-color: var(--color-tint);

    /* 浏览器原生滚动使用的导航栏停留顶部 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */

  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 51px;
  } */

  .content {
    /* height: 300px; */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
