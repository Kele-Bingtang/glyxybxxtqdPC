<template>
  <div>
    <svg-icon :icon-class="icon" />
    <span slot='title'>{{title}}</span>
   <!-- <el-badge class="badge" :value="num"></el-badge>-->
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  /*functional: true,*/
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    badge: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      num: 999
    }
  }
  /*render(h, context) {
    const { icon, title, badge } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }

    if (badge){
      //vnodes.push(<el-badge :value="num"></el-badge>)
    }
    return vnodes
  }*/
}
</script>
<style lang="scss">
  .menu-item {
    .el-badge__content {
      border-color: #F56C6C;
      height: 22px;
      line-height: 22px;
      padding: 0px 8px;
    }
  }
</style>
<style lang="scss" scoped>
  .menu-item {
    display: flex;
    align-items: center;
    position: relative;
    .badge {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      margin-top: 6px;
    }
  }
</style>
