import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation.types'

export default {
  // 参数1：context 上下文
  addCart({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      // state.cartList.push(payload)
      // 找到是否有存在的对象
      let oldProduct = state.cartList.find(function (item) {
        return item.iid === payload.iid
      })
      // 有就修改数量，没有就增加条目
      if (oldProduct) {
        // oldProduct.count += 1
        commit(ADD_COUNTER, oldProduct)
        resolve('当前的商品数量+1')
      } else {
        payload.count = 1
        // state.cartList.push(payload)
        commit(ADD_TO_CART, payload)
        resolve('添加新商品')
      }
    })
  }
}
