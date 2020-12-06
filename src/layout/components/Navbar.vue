<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!--<breadcrumb class="breadcrumb-container" />-->
    <tags-view class="tagview-container" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import TagsView from './TagsView'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    TagsView
  },
  computed: {
    ...mapState(['showTagsview']),
    ...mapGetters(['sidebar'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 36px;
  /* update by lct on 20190718 */
  //overflow: hidden;
  /* update by lct on 20190718 */
  position: relative;
  background: #fff;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  /* add by lct on 20190718 */
  display: flex;
  border-bottom: 1px solid #d8dce5;
  /* add by lct on 20190718 */

  .hamburger-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    cursor: pointer;
    border-right: 1px solid #edf0f5;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  /* add by lct on 20190718 */
  .tagview-container {
    flex: 1;
  }
  /* add by lct on 20190718 */

  .breadcrumb-container {
    float: left;
  }
}
</style>
