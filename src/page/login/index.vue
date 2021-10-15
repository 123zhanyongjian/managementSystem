<template>
  <div class="login">
    <div class="content">
      <!-- logo -->
      <img
        src="./img/logo.png"
        width="230px"
        class="logo"
        alt=""
      >
      <!-- 系统名称 -->
      <p class="systemName">
        Experiment Process Design system
      </p>
      <div class="inputs"> -->
        <p class="title">{{ $t('登录') }}</p>
        <div class="user-name">
          <span
            class="chClass cursor"
            :style="{background:lang==='zh_CN'?'#00B8A4':'rgb(31,67,76)',color:lang==='zh_CN'?'#fff':'rgb(70,99,106)'}"
            @click="changeLanguage('zh_CN')"
          >中文</span>
          <span
            class="enClass cursor"
            :style="{background:lang==='zh_CN'?'rgb(31,67,76)':'#00B8A4',color:lang==='zh_CN'?'rgb(70,99,106)':'#fff'}"
            @click="changeLanguage('en_US')"
          >ENG</span>
        </div>
        <el-row
          class="contentinput"
          :gutter="20"
        >

          <p class="titles">{{ $t('登录账号') }}</p>
          <div>
            <el-input
              v-model="formData.user"
              :placeholder="$t('请输入账号')"
            />
            <img
              width="15px"
              src="./img/lock.png"
              alt=""
            >
            <p v-if="false" class="errorTip">12323</p>
          </div>

          <p class="titles">{{ $t('登录密码') }}</p>
          <div>
            <el-input
              v-model="formData.pass"
              type="password"
              :placeholder="$t('请输入密码')"
              @keyup.enter.native="login"
            />
            <img
              width="15px"
              src="./img/user.png"
              alt=""
            >
          </div>
          <p class="titles">{{ $t('验证码') }}</p>
          <div>
            <el-input
              v-model="formData.codes"
              :placeholder="$t('请输入验证码')"
              @keyup.enter.native="login"
            />

            <img
              class="code cursor"
              width="40px"
              :src="userCode"
              alt=""
              @click="getCodeS"
            >
          </div>

          <el-button
            class="btn"
            type="primary"
            :disabled="!formData.user||!formData.pass||!formData.codes"
            @click="login"
          >{{ $t('登录账号') }}</el-button>
          <!-- 报错提示 -->
          <p
            v-if="errMessage"
            class="errClass"
          >{{ errMessage }}</p>
        </el-row>

      </div>

    </div>

  </div>
</template>
<script>
import { setCookies, getCookies } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      formData: {
        user: '',
        codes: '',
        pass: ''
      },
      rules: {
        user: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        codes: {
          required: true,
          trigger: 'blur', message: '不可为空'
        },
        pass: {
          required: true,
          trigger: 'blur', message: '不可为空'
        }
      },
      lang: getCookies('LANG_6PL_E3') || 'zh_CN'
    }
  },
  computed: {
    ...mapGetters(['aaad', 'userCode']),
    errMessage() {
      return this.$store.state.user.errMessage
    }
  },
  created() {
    this.getCodeS()
  },
  methods: {
    // 多语言选择事件
    changeLanguage(lang) {
      setCookies('LANG_6PL_E3', lang)
      this.lang = lang
      this.$i18n.locale = lang
      location.reload()
    },
    getCodeS() {
      this.$store.dispatch('userGetCode')
    },
    login() {
      if (!this.formData.user || !this.formData.pass || !this.formData.codes) {
        return
      }
      this.$store.dispatch('UserLogin', {
        userName: this.formData.user,
        password: this.formData.pass,
        validateCode: this.formData.codes
      })
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  background-image: url('./img/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  min-width: 1000px;
  bottom: 0;
}
.logo {
  position: absolute;
  left: 7.2%;
  top: 200px;
}
.systemName {
  position: absolute;
  left: 8%;
  width: 538px;
  bottom: 18%;
  font-size: 50px;
  text-align: left;
  color: #fff;
  font-weight: 100;
}
.inputs {
  width: 41.6%;
  height: 100vh;
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  .title {
    position: absolute;
    left: 12.2%;
    top: 200px;
    font-size: 50px;
    color: #fff;
  }
  .user-name {
    position: absolute;
    right: 19%;
    top:210px;
    .chClass {
      width: 48px;
      line-height: 24px;
      height: 24px;
      background: #00b8a4;
      color: #fff;
      border-radius: 100px 0px 0px 100px;
      display: inline-block;
    }
    .enClass {
      width: 48px;
      line-height: 24px;
      height: 24px;
      background: #00b8a4;
      color: #fff;
      border-radius: 0px 100px 100px 0px;
      display: inline-block;
    }
  }
  .el-col {
    margin-top: 3%;
  }
  .el-input /deep/ input {
    outline: none;
    border: none;
    border-bottom: 1px solid #ccc;
  }
  .el-button {
    width: 100%;
  }
  .contentinput {
    position: absolute;
    // overflow: hidden;
    margin: 0 !important;
    left: 0;
    right: 0;
    padding: 0px 19.2% 0 12.5%;
    top: 300px;
    .titles {
      text-align: left;
      padding: 0;
      font-size: 16px;
      color: #fff;
      margin: 37px 0 19px 0;
    }
    div {
      position: relative;
      img {
        position: absolute;
        right: 0;
        bottom: 0;
        right: 2px;
        bottom: 13px;
      }
      .code {
        width: 120px;
        height: 50px;
      }
    }
    .btn {
      margin-top: 11%;
      height: 50px;
      width: 230px;
      float: left;
    }
    .btn::after {
      clear: both;
      display: block;
      content: '';
    }
  }
}
.errClass {
  height: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #ff5d75;
  line-height: 14px;
  top:470px;
  left: 100px;
  position: absolute;
}
.errorTip{
    position: absolute;
    left:  10px;
    bottom: -25px;
     height: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #ff5d75;
  line-height: 14px;
}
</style>
<style lang="less">
.login {
    .el-button--primary:focus,  .el-button--primary:hover{
        font-size: 16px !important;
    }
     input::-webkit-input-placeholder {
       color: rgba(255, 255, 255, .7)!important;

      }
      input::-moz-input-placeholder {
       color: rgba(255, 255, 255, .7)!important;

      }
      input::-ms-input-placeholder {
      color: rgba(255, 255, 255, .7)!important;

      }
  .el-input,
  .el-input__inner {
    background: transparent !important;
    color: #fff !important;
    padding: 0;
    border-bottom: 1px solid rgb(70, 99, 107) !important;
  }
  ::-webkit-input-placeholder {
    font-size: 18px;
    opacity: 0.4;
  }
  .el-form-item__label {
    text-align: left;
    padding: 0 15px;
    font-size: 16px;
    color: #fff;
    margin: 19px 0;
  }
}
</style>
