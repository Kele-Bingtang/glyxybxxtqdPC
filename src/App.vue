<template>
  <div id="app">
    <!--<transition name="fade-transform-mobile" mode="out-in">-->
      <keep-alive :include="cachedViews">
        <router-view />
      </keep-alive>
    <!--</transition>-->
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>
<style lang="scss">
  // vant notify样式
  .van-notify.my-notify {
    padding: 30px 0;
    font-size: 28px;
  }
  .my-notify.success {
    background-color: #07C160!important;
  }
  .my-notify.error {
    background-color: #ff7967!important;
  }
</style>
