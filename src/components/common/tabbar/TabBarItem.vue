<template>
    <div class="tab-bar-item" @click="itemClick">
      <div v-if="!isActive">
        <slot name="item-icon"></slot>
      </div>
      <div v-else>
        <slot name="item-icon-act"></slot>
      </div>
      <div :style="activeStyle">
        <slot name="item-text"></slot>
      </div>
      <!-- <img src="../../assets/img/tabbar/home.svg" alt="">
      <div>首页</div> -->
    </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    path: {
      type: String,
      default: ''
    },
    activeColor: {
      type: String,
      default: '#F63275'
    }
  },
  data() {
    return {
      // isActive: false
    }
  },
  computed: {
    isActive() {
      return !this.$route.path.indexOf(this.path)
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick() {
      // console.log('itemClick');
      this.$router.replace(this.path).catch(err => {err})
    }
  }
}
</script>

<style>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }

  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 1px;
  }
</style>
