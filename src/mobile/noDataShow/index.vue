<template>
  <div class="no-data">
    <i class="iconfont icon-wushuju"></i>
    <p>{{showText}}</p>
  </div>
</template>

<script>
export default {
  name: 'NoDataShow',
  props: {
    showText: {
      type: String,
      default: '没有数据'
    }
  }
}
</script>

<style lang="scss" scoped>
  .no-data {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon-wushuju {
      font-size: 100px;
      color: #a5a5a5;
    }
    p {
      color: #a5a5a5;
      font-size: 30px;
      margin-top: 30px;
    }
  }
</style>
