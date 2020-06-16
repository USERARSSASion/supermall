<template>
  <div id="category">
    <NavBar class="cate-nav"><div slot="center">商品分类</div></NavBar>
    <div class="content">
      <TabMenu
        @selectItem='selectItem'
        :categories='categories'/>
      <Scroll id="tab-content" :data="[categoryData]">
        <div>
          <TabContentCategory
            :subcategories='showSubcategory'></TabContentCategory>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/common/navbar/NavBar'

import Scroll from '@/components/common/scroll/Scroll'
import TabMenu from './childComps/TabMenu'
import TabContentCategory from './childComps/TabContentCategory'

import { getCategory, getSubcategory, getCategoryDetail } from '@/network/category'
import { POP, SELL, NEW } from "@/common/const";

export default {
  name: 'Category',
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
      scroll: null
    }
  },
  components: {
    NavBar,
    TabMenu,
    Scroll,
    TabContentCategory
  },
  created() {
    this.getCategoryData()
  },
  mounted() {
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {}
      console.log(this.categoryData[this.currentIndex].subcategories)
      return this.categoryData[this.currentIndex].subcategories
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return []
      return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
    }
  },
  methods: {
    async getCategoryData() {
      const categoryData = await getCategory();
      this.categories = categoryData.data.category.list;
      for (let i = 0; i < this.categories.length; i++) {
        const category = this.categories[i];
        const { maitKey } = category;
        this.categoryData[i] = {
          subcategories: {},
          categoryDetail: {
            [POP]: [],
            [SELL]: [],
            [NEW]: []
          }
        }
      }

      this.getSubcategories(0);
    },
    async getSubcategories(index) {
      this.currentIndex = index;
      const mailKey = this.categories[index].maitKey;

      const subCategoryData = await getSubcategory(mailKey);
      this.categoryData[index].subcategories = subCategoryData.data;
      this.getCategoryDetail()
    },
    async getCategoryDetail() {
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      const popData = await getCategoryDetail(miniWallkey, POP);
      const sellData = await getCategoryDetail(miniWallkey, SELL);
      const newData = await getCategoryDetail(miniWallkey, NEW);
      this.categoryData[this.currentIndex].categoryDetail[POP] = popData;
      this.categoryData[this.currentIndex].categoryDetail[SELL] = sellData;
      this.categoryData[this.currentIndex].categoryDetail[NEW] = newData;
      this.categoryData = { ...this.categoryData }
    },
    selectItem(index) {
      this.getSubcategories(index);
    }
  }
}
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .cate-nav {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
</style>
