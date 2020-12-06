<template>
  <div class="dashboard" :style="{ background: color }">
    <div class="top">
      <div class="icon">
        <svg-icon :icon-class="icon"></svg-icon>
      </div>
      <div class="count">{{value}}</div>
    </div>
    <div class="bottom">
      {{label}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dashboard',
    props: {
      color: {
        type: String,
        default: '#13ce66'
      },
      icon: {
        type: String,
        default: 'dashboard-zbxd'
      },
      value: {
        type: [String, Number],
        required: true
      },
      label: {
        type: String,
        required: true
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    width: 100%; // 380px;
    height: 180px;
    color: #fff;
    background-color: #13ce66;

    &:hover .count{
      font-size: 58px !important;
    }

    .top {
      height: 120px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .icon {
        width: 150px;
        font-size: 52px;
        text-align: center;
      }

      .count {
        flex: 1;
        font-size: 50px;
        text-align: right;
        line-height: 45px;
        margin-right: 30px;
        word-break: break-all;
        transition: all .2s;
      }
    }

    .bottom {
      height: 60px;
      line-height: 60px;
      text-align: right;
      margin-right: 30px;
    }
  }
</style>
