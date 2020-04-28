import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from '@/components/common/toast'

Vue.config.productionTip = false
// vue 实例可以当做事件总线
Vue.prototype.$bus = new Vue()
// 安装 toast 插件
Vue.use(toast)
// 解决移动端 300ms 的延迟
FastClick.attach(document.body)
// 使用懒加载插件
Vue.use(VueLazyLoad, {
  loading: require('@/assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

// polyfill 补丁，可以使浏览器支持一些东西 eg: Promise polyfill
// vue-lazyload 图片懒加载组件
// postcss-px-to-viewport 将 px 转化成 vh
// 设计稿以 iPhone6(750*1334)

// Vue 的响应式原理
/*
  不要认为数据发生改变，界面跟着更新是理所当然的
*/
