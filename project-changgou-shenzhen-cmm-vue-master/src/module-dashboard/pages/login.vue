<template>
  <div class="login-container">
    <div class="loginMain">
      <div class="loginCon">
        <div class="loginLogo"></div>
        <el-form class="loginForm" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <el-form-item prop="loginName">
        <span class="userIcon"></span>
        <el-input name="loginName" type="text" v-model="loginForm.loginName" autoComplete="on" placeholder="邮箱/手机号" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="pwdIcon"></span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
      </el-form-item>
      <!-- <el-form-item>
        <span class="codeIcon"></span>
        <el-input v-model="loginForm.code" class="inputw" placeholder="验证码"></el-input>
        <span class="codeImg"><img src="../../assets/code.jpg"></span>
      </el-form-item> -->
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>

    </el-form>
      </div>
    </div>
    


  </div>
</template>

<script>
import { validateEmail } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import {login} from '@/api/base/frame'
import loginSocialSignin from './../components/loginSocialSignin'
import shajs from 'sha.js'
import {setToken,getToken} from '@/utils/auth'
export default {
  components: { LangSelect, loginSocialSignin },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value==='') {
        callback(new Error('Please enter the email user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginName: 'admin',
        password: '123456'
        // code:''
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      var _this=this
      this.$refs.loginForm.validate(valid => {
        // console.log(shajs('sha256').update(this.loginForm.password).digest('hex'))
        if (valid) {
          this.$router.push('/commodity/list')
          // this.$store
          // .dispatch('LoginByUsername', {
          //   loginName: this.loginForm.loginName,
          //   password: this.loginForm.password
          // })
          // .then(() => {
          //   this.loading = false
          //   this.$router.push('/commodity/list')
          // })
          // .catch(() => {
          //   this.loading = false
          // })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
// .login-container {
//   .el-input {
//     display: inline-block;
//     height: 47px;
//     width: 85%;
//     input {
//       background: transparent;
//       border: 0px;
//       -webkit-appearance: none;
//       border-radius: 0px;
//       padding: 12px 5px 12px 15px;
//       color: $light_gray;
//       height: 47px;
//       &:-webkit-autofill {
//         -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
//         -webkit-text-fill-color: #fff !important;
//       }
//     }
//   }
//   .el-form-item {
//     border: 1px solid rgba(255, 255, 255, 0.1);
//     background: rgba(0, 0, 0, 0.1);
//     border-radius: 5px;
//     color: #454545;
//   }
// }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background:url(../../assets/logingBg.jpg);
  // .login-form {
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   width: 520px;
  //   padding: 35px 35px 15px 35px;
  //   margin: 120px auto;
  // }
  // .tips {
  //   font-size: 14px;
  //   color: #fff;
  //   margin-bottom: 10px;
  //   span {
  //     &:first-of-type {
  //       margin-right: 16px;
  //     }
  //   }
  // }
  // .svg-container {
  //   padding: 6px 5px 6px 15px;
  //   color: $dark_gray;
  //   vertical-align: middle;
  //   width: 30px;
  //   display: inline-block;
  //   &_login {
  //     font-size: 20px;
  //   }
  // }
  // .title-container {
  //   position: relative;
  //   .title {
  //     font-size: 26px;
  //     font-weight: 400;
  //     color: $light_gray;
  //     margin: 0px auto 40px auto;
  //     text-align: center;
  //     font-weight: bold;
  //   }
  //   .set-language {
  //     color: #fff;
  //     position: absolute;
  //     top: 5px;
  //     right: 0px;
  //   }
  // }
  // .show-pwd {
  //   position: absolute;
  //   right: 10px;
  //   top: 7px;
  //   font-size: 16px;
  //   color: $dark_gray;
  //   cursor: pointer;
  //   user-select: none;
  // }
  // .thirdparty-button {
  //   position: absolute;
  //   right: 35px;
  //   bottom: 28px;
  // }
  

}
</style>
