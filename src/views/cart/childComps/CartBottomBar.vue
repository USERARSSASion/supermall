<template>
  <div class="bottom-bar">
    <div class="check-content">
      <CheckButton
        :isChecked="isSelectAll"
        @click.native="checkClick"
        class="check-button"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计：￥{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算 ({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from '@/components/content/checkButton/CheckButton'

import { mapGetters } from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return this.cartList.reduce((cur, nxt) => {
        if (nxt.checked) {
          cur += parseFloat(nxt.price) * parseInt(nxt.count)
        }
        return cur
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false
      // return !(this.cartList.filter(item => !item.checked).length)
      return !this.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) { // 全部选中
        this.cartList.forEach(item => item.checked = false)
      } else { // 部分或全部不选中
        this.cartList.forEach(item => item.checked = true)
      }
      // this.cartList.forEach(item => item.checked = !this.isSelectAll)
    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品')
      }
    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;

    height: 40px;
    line-height: 40px;

    background-color: eee;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
  }
</style>
