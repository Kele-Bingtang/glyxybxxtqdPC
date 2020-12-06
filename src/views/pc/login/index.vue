<template>
  <div class="login-container">
    <div class="login-header">
      <div class="login-header-logo">
        <img src="@/assets/logo/logo.png" alt=""/>
      </div>
    </div>
    <div class="login-content">
      <div class="login-content-mask blur"></div>
      <div class="login-content-bgcolor"></div>
      <div class="login-content-dialog">

        <div class="login-content-dialog-title">{{title}}</div>
        <div class="login-content-dialog-form">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <div class="title-container">
              <p class="title">欢迎登录</p>
            </div>

            <el-form-item prop="account">
            <span class="svg-container">
              <svg-icon icon-class="user"/>
            </span>
              <el-input
                ref="account"
                v-model="loginForm.account"
                placeholder="帐号"
                name="account"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"/>
            </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
            </span>
            </el-form-item>
            <el-form-item class="checked">
              <el-checkbox v-model="checked">记住登录状态</el-checkbox>
            </el-form-item>

            <el-button class="button" :loading="loading" type="primary" @click.native.prevent="handleLogin">登&nbsp;录</el-button>

          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import { setCookie, getCookie } from '@/utils/cookie'
import store from '@/store'

export default {
  name: 'Login',
  data() {
    return {
      title: '', // 项目名称
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', message: '请输入帐户名称' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      checked: true,
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  created() {
    this.title = store.getters.config.title || settings.title
    const LoginInfo = getCookie()
    if (LoginInfo) {
      this.loginForm = JSON.parse(LoginInfo)
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            // 记住登录状态
            if (this.checked) {
              setCookie(this.loginForm, true)// 设定cookie失效时间，在关闭浏览器之后仍然有效
            } else {
              setCookie(this.loginForm, false)// cookie在关闭浏览器之后失效
            }
            this.$message.success('登录成功')
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((error) => {
            console.log(error)
            this.loading = false
            this.$message.error('登录失败，请重新尝试')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #f3f6f8;
  $border-color: #dce4e6;
  $input-color: #666;
  $checked-color: #7C6EE6;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $input-color;
        height: 47px;
        caret-color: $input-color;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid $border-color;
      background: $bg;
      border-radius: 5px;
    }

    .checked {
      background: transparent;
      border: none;
      padding-left: 2px;
    }
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: $checked-color;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: $checked-color;
      border-color: $checked-color;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: $checked-color;
    }

  }
</style>

<style lang="scss" scoped>
  $bg: #034383;
  $dark_gray: #889aa4;
  $light_gray: #666;
  $checked-color: #7C6EE6;

  .blur {
    filter: blur(3px);
  }

  .login-container {
    min-height: 100%;
    width: 100%;
    background-size: cover;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;

    .login-header {
      height: 0;//134px;
      background-color: $bg;
      padding: 0 120px 0 100px;

      &-logo {
        height: 100%;
        background-image: url("../../../assets/login_images/top_bg.jpg");
        background-repeat: no-repeat;
        background-position-x: right;
        display: flex;
        align-items: center;

      }
    }

    .login-content {
      flex: 1;
      width: 100%;
      margin: 0 auto;
      background: #fff; //linear-gradient(#2F6498, #accee5, #FFFFFF); /* 标准语法 */
      position: relative;


      &-mask {
        width: 100%;
        height: 100%;
        position: absolute;
        background-image: url("../../../assets/login_images/bg_image.png");
        background-repeat: no-repeat;
        background-size: cover;
        z-index: 1;
      }
      &-bgcolor {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(10, 16, 12, 0.3);
        z-index: 2;
      }

      &-dialog {
        position: absolute;
        top: 180px;
        right: 180px;
        &-title {
          color: #fff;
          font-size: 28px;
          text-align: center;
          margin: 0 auto;
          position: relative;
          z-index: 3;
        }

        &-form {
          width: 500px;
          height: auto;
          margin: 20px auto;
          padding: 35px 30px;
          border-radius: 6px;
          background: #fff;
          box-shadow: 1px 1px 4px #767676;
          position: relative;
          z-index: 3;
          box-sizing: border-box;
        }
      }




      .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 0 35px 0;
        margin: 0 auto;
        overflow: hidden;
        z-index: 2;
        box-sizing: border-box;
      }

      .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }

      .title-container {
        position: relative;

        .title {
          font-size: 22px;
          color: $light_gray;
          margin: 0px auto 40px auto;
          text-align: center;
        }
      }

      .button {
        width: 100%;
        height: 54px;
        margin: 10px 0;
        background: $checked-color;
        border: none;
        font-size: 20px;
      }

      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }
    }

  }
</style>
