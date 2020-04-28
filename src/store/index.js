import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 安装插件
Vue.use(Vuex)

const state = {
  cartList: []
}
// 创建 Store 对象
const store = new Vuex.Store({
  state,
  // mutation 唯一的目的就是修改 state 中的状态
  // mutation 中的每个方法尽可能完成的事件比较单一
  mutations,
  actions,
  getters
})

// 挂载 vue 实例上
export default store
