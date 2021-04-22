<template>
  <div class="header">
    <div class="left-title">
      <img class="img" src="@/assets/logo/logo.png" alt="">
      {{title}}
    </div>
    <div class="right-badge">
      <el-popover
        placement="bottom"
        trigger="click">
        <div class="popover-content">
          <p class="title">维修中</p>
          <p class="content" v-if="bxdCount > 0">目前还有<span class="num">{{bxdCount}}</span>条报修单正在处理哦~</p>
          <p class="content" v-else>暂无可处理报修单~</p>
        </div>
        <el-badge
          slot="reference"
          :value="bxdCount"
          :hidden="bxdCount ? false : true"
          :max="99"
          class="item">
          <i class="el-icon-message-solid"></i>
        </el-badge>
      </el-popover>

    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <div class="user-avatar">
            <i class="el-icon-user"></i>
          </div>
          <span class="user-name">{{name}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided command="logout">
              <i class="el-icon-back"></i>
              <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import { mapGetters } from 'vuex'
export default {
  name: 'Header',
  computed: {
    ...mapGetters([
      'name',
      'bxdCount',
      'config'
    ]),
    title () {
      return this.config.title
    }
  },
  methods: {
    exitFullscreen(){
      if(document.exitFullScreen){
        document.exitFullscreen()
      }
//     		//兼容火狐
//     		console.log(document.mozExitFullScreen)
      if(document.mozCancelFullScreen){
        document.mozCancelFullScreen()
      }
//     		//兼容谷歌等
      if(document.webkitExitFullscreen){
        document.webkitExitFullscreen()
      }
//     		//兼容IE
      if(document.msExitFullscreen){
        document.msExitFullscreen()
      }
    },
    async logout() {
      this.$store.dispatch('bxd/clearDeclare')
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      this.exitFullscreen();
    },
    handleCommand(val) {
      if (val === 'logout') {
        this.logout()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    background-color: #242F42;
    color: #fff;
    font-size: 22px;
    height: 66px;
    display: flex;
    align-items: center;
    .left-title {
      float: left;
      margin-left: 20px;
      .img {
        height: 40px;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
    .right-badge {
      position: absolute;
      top: 22px;
      right: 220px;
      cursor: pointer;
      i {
        font-size: 26px;
      }
    }
    .right-menu {
      position: absolute;
      right: 10px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          display: flex;
          align-items: center;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          user-select: none;

          .user-avatar {
            width: 36px;
            height: 36px;
            color: #000;
            background: #fff;
            border-radius: 50%;
            font-size: 22px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .user-name {
            margin: 0 5px 0 8px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
          }
        }
      }
    }
  }
  .popover-content {
    .title {
      margin: 0;
      font-size: 16px;
      color: #ff484f;
      font-weight: 600;
    }
    .content {
      font-size: 14px;
      color: #656565;
      margin: 5px 0 0 0;
      .num {
        color: #ff5151;
      }
    }
  }
</style>
