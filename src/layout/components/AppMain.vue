<template>
  <section class="app-main">
    <!--<transition name="fade-transform" mode="out-in">-->
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    <!--</transition>-->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
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

<style scoped>
.app-main {
  /*50 = navbar 34 = tag-view  */
  /*min-height: calc(100vh - 50px);*/

  /*update 2020/05/25*/
  /*width: 100%;*/

  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  /*position: absolute;*/
  /*top: 84px;*/
  /*bottom: 0;*/
}

.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
