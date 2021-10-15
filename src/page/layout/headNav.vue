<template>
  <div id="common-header" ref="layoutHeader" class="header">
    <div class="navTab">
      <div id="bread_container" class="bread_container">
        <span class="collapse-btn" @click="collapseChage">
          <img v-if="!isCollapse" :src="iconhide" alt="">
          <img v-else :src="iconshow" alt="">
        </span>

      </div>
      <topMenu />
      <div class="header-right">
        <div class="header-user-con">
          <div class="user-name">
            <img style="vertical-align: middle" :src="theme!=='dark'?src1:src" alt="" @click="themes">
          </div>

          <div class="user-avator">
            <img :src="head">
          </div>
          <!-- 用户名下拉菜单 -->
          <el-dropdown class="user-name" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo.user.nickName }}
              <i class="el-icon-caret-bottom" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="resetPassword">{{ $t('修改密码') }}</el-dropdown-item>
              <el-dropdown-item command="loginout">{{ $t('退出登录') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 多语言下拉 -->
          <div class="user-names">
            <span :style="{color:lang==='zh_CN'&&theme==='dark'?'rgba(255,255,255,1)':lang==='zh_CN'&&theme!=='dark'?'rgba(0,0,0,1)':lang!=='zh_CN'&&theme!=='dark'?'rgba(0,0,0,.5)':'rgba(255,255,255,.5)'}" @click="changeLanguage('zh_CN')">中文</span>
            <span style="margin-left: 13px;margin-right: 13px;">|</span>
            <span :style="{color:lang==='en_US'&&theme==='dark'?'rgba(255,255,255,1)':lang==='en_US'&&theme!=='dark'?'rgba(0,0,0,1)':lang!=='en_US'&&theme!=='dark'?'rgba(0,0,0,.5)':'rgba(255,255,255,.5)'}" @click="changeLanguage('en_US')">ENG</span>
          </div>
          <!-- 全屏显示 -->
          <!-- <div class="btn-fullscreen" @click="handleFullScreen">
            <el-tooltip effect="dark" :content="fullscreen ? $t('取消全屏') : $t('全屏')" placement="bottom">
              <i class="el-icon-rank" />
            </el-tooltip>
          </div> -->

          <!-- <el-dropdown class="user-name" trigger="click" @command="handleCommand1">
            <span class="el-dropdown-link">
              <img class="country-icon-1" :src="lang === 'zh' ? zhIcon:lang === 'en' ? enIcon:alIcon" alt="">

            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh">
                <img class="country-icon" :src="zhIcon" alt="">
              </el-dropdown-item>
              <el-dropdown-item command="en">
                <img class="country-icon" :src="enIcon" alt="">
              </el-dropdown-item>
              <el-dropdown-item command="ar">
                <img class="country-icon" :src="alIcon" alt="">
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <!-- 用户头像 -->

        </div>
      </div>
    </div>
    <!-- <tags-view /> -->
    <!-- 修改密码 弹窗 -->
    <el-dialog :title="$t('修改密码')" :visible.sync="pswVisible" width="600" label-width="100px">
      <el-form ref="pwdForm" v-loading="pswLoading" :model="pwdForm" status-icon :rules="rules">
        <el-form-item :label="$t('原密码')" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('新密码')" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('新密码')" prop="newPassword_1">
          <el-input v-model="pwdForm.newPassword_1" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="true" class="operate">
          <span class="cancel cursor" size="small" @click="pswVisible = false">{{ $t('取消') }}</span>
          <!-- <el-button v-if="resetBtnVisible" type="primary" plain size="small" @click="handleReset">{{ $t('重置') }}</el-button> -->
          <el-button class="confirm" type="primary" size="small" @click="onSubmit">{{ $t('确认') }}</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- <messageDialog v-if="messageVisible" :visible.sync="messageVisible" :row="currentRow" @onMessage="onMessage" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { getCookies, setCookies } from '@/utils/auth'
import { password } from '@/api/system/user'
// import zhIcon from '@/assets/img/zh-icon.png'
// import enIcon from '@/assets/img/en-icon.png'
// import alIcon from '@/assets/img/th-icon.png'
// import tagsView from '@/components/tagsView'
import topMenu from './topMenu'
const head = localStorage.theme ? require('@/assets/img/head.png') : require('@/assets/img/heads.png')
const iconhide = localStorage.theme ? require('@/assets/img/darkhide.png') : require('@/assets/img/whitehide.png')
const iconshow = localStorage.theme ? require('@/assets/img/darkshow.png') : require('@/assets/img/whiteshow.png')
export default {
  name: 'HeadNav',
  components: {
    // tagsView,
    topMenu
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.pwdForm.newPassword_1 !== '') {
          this.$refs.pwdForm.validateField('newPassword_1')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      head,
      iconhide,
      iconshow,
      src: require('@/assets/img/dark.png'),
      src1: require('@/assets/img/white.png'),
      messageVisible: false,
      currentRow: {},
      pswLoading: false,
      pwdForm: {
        oldPassword: '',
        newPassword: '',
        newPassword_1: ''
      },
      pswVisible: false,
      rules: {
        oldPassword: [
          { required: true, message: this.$t('请输入原密码'), trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: this.$t('请输入新密码'), trigger: 'blur' },
          { validator: validatePass1, trigger: 'blur' }
        ],
        newPassword_1: [
          { required: true, message: this.$t('请再次输入密码'), trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      lang: 'zh_CN',
      fullscreen: false,
      messageNum: '',
      socket: '',
      srcc: '',
      // src: `ws://183.3.221.229:22261/ws/imserver/${store.state.user.userInfo.userId}/${store.state.user.userInfo.userName}/${store.state.user.userInfo.siteCode}/${store.state.user.userInfo.siteName}`,
      // src: `ws://192.168.100.66:8080/ws/imserver/${store.state.user.userInfo.userId}/${store.state.user.userInfo.userName}/${store.state.user.userInfo.siteCode}/${store.state.user.userInfo.siteName}`,
      messagelist: [],
      theme: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'sidebar', 'isCollapse']),
    headNavWidth() {
      return document.body.clientWidth - this.sidebar.width
    }
  },
  created() {
    // this.openSocket()
  },
  mounted() {
    this.lang = getCookies('LANG_6PL_E3')
    this.theme = localStorage.theme ? 'dark' : 'white'
  },
  methods: {
    themes() {
      if (!localStorage.theme) {
        localStorage.theme = localStorage.themes = true
      } else {
        localStorage.theme = localStorage.themes = ''
      }
      location.reload()
    },
    onSubmit() {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          password({
            newPassword: this.pwdForm.newPassword,
            password: this.pwdForm.oldPassword,
            rePassword: this.pwdForm.newPassword_1,
            id: this.userInfo.id
          }).then((res) => {
            this.pswVisible = false
            this.$message.success(this.$i18n.tc(res.message))
            setTimeout(() => {
              store.dispatch('userResetToken')
            }, 1000)
          })
        }
      })
    },
    openSocket() {
      console.log(this.src)
      if (typeof (WebSocket) === 'undefined') {
        console.log(this.$i18n.tc('您的浏览器不支持WebSocket'))
      } else {
        this.socket = new WebSocket(this.src)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
        console.log(this.getMessage)
      }
    },
    open() {
      console.log('socket连接成功')
    },
    error() {
      console.log('连接错误')
    },
    getMessage(msg) {
      if (msg.data !== this.$i18n.tc('连接成功') && msg.data) {
        console.log(JSON.parse(msg.data))
        this.messageNum = JSON.parse(msg.data).num
        const _this = this
        const h = this.$createElement
        JSON.parse(msg.data).list.forEach((item, index) => {
          setTimeout(function () {
            // 叠加展示 关闭之前展示的消息
            if (_this.notifyInstance) {
              _this.notifyInstance.close()
            }
            _this.notifyInstance = _this.$notify({
              title: _this.$i18n.tc(item.title),
              dangerouslyUseHTMLString: true,
              //  _this.$i18n.tc('运单编号:')    message: '运单编号:' + _this.$i18n.tc(item.waybillNo) + '<br>' + _this.$i18n.tc(item.messageContent) + '<br>' + '扫描时间' + _this.$i18n.tc(item.waybillNo),
              message: h('p', [
                h('p', { style: 'cursor: pointer;', on: { click: () => { _this.onClickMessage() } }}, _this.$i18n.tc('运单编号:') + _this.$i18n.tc(item.waybillNo)),
                h('p', { style: 'cursor: pointer;', on: { click: () => { _this.onClickMessage() } }}, _this.$i18n.tc(item.messageContent)),
                h('p', { style: 'cursor: pointer;', on: { click: () => { _this.onClickMessage() } }}, _this.$i18n.tc('扫描时间') + _this.$i18n.tc(item.waybillNo))
              ]),
              position: 'bottom-right',
              type: 'warning'
            })
          }, 1000 * index)
        })
      }
    },
    onClickMessage() {
      this.messageVisible = true
    },
    onMessage() {
      this.notifyInstance.close()
      this.messageNum = ''
      this.$router.push({ path: '/message/message' })
    },
    send(params) {
      this.socket.send(params)
    },
    close() {
      console.log('socket已经关闭')
    },
    sendMessage() {
      if (typeof (WebSocket) === 'undefined') {
        console.log('您的浏览器不支持WebSocket')
      } else {
        console.log('您的浏览器支持WebSocket')
      }
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === 'loginout') {
        this.$confirm(this.$tc('确定要退出登录吗?'), this.$t('提示'), {
          confirmButtonText: this.$t('确认'),
          cancelButtonText: this.$t('取消'),
          cancelButtonClass: 'conffirmMessageCancle',
          customClass: 'miniMessage'

        }).then(() => {
          store.dispatch('userResetToken')
        }).catch(() => {

        })
      } else if (command === 'resetPassword') {
        this.pswVisible = true
      }
    },
    // 多语言选择事件
    changeLanguage(lang) {
      if (lang === this.lang) {
        return
      }
      setCookies('LANG_6PL_E3', lang)
      this.lang = lang
      this.$i18n.locale = lang

      location.reload()
    },
    // 全屏事件
    handleFullScreen() {
      const element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      this.$store.dispatch('layoutSetLeftCollapse') // 折叠菜单
      // this.$store.dispatch('handleLeftMenu') // 改变菜单宽度 180->35/35-180
    }
  }
}
</script>

<style scoped lang='less'>
.header {
  position: relative;
  box-sizing: border-box;
  background: white;
  width: 100%;
  height: 58px;
  font-size: 22px;
  color: rgba(140, 160, 179, 1);
}

.header-right {
  // float: right;
  // padding-right: 50px;
  position: absolute;
  right: 50px;
  top: 0;
}

.header-user-con {
  display: flex;
  height: 39px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  background: #f56c6c;
  color: rgba(140, 160, 179, 1);
}

.btn-bell .el-icon-bell {
  color: rgba(140, 160, 179, 1);
}

.user-name {
  margin-left: 12px;
  cursor: pointer;
  img{
      height: 24px;
  }
}
.user-names{
  margin-left: 28px;
  cursor: pointer;
}

.user-avator {
  margin-left: 28px;
}

.user-avator img {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.white{
    .el-dropdown-link {
  color: rgba(0, 0, 0, .5);
  cursor: pointer;
}
}

.dark{
    .el-dropdown-link {
  color: rgba(255, 255, 255, .5);
  cursor: pointer;
}
}

.el-dropdown-menu--mini {
  .el-dropdown-menu__item {
    padding: 3px 13px;
    font-size: 13px;
  }
}

.bread_container {
  background-color: #eaebec;
  width: 100%;
  .collapse-btn {
    display: block;
    float: left;
    margin-left: 15px;
    line-height: 39px;
    i {
      cursor: pointer;
      font-size: 24px;
    }
  }
  .breadcrumb {
    float: left;
    margin-left: 15px;
    height: 39px;
    line-height: 39px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #97a8be;

    .breadbutton {
      float: left;
      margin: 4px 5px 0 0;
    }
  }
}
.header-right {
  /deep/.el-badge__content {
    background: rgba(241, 34, 34, 1);
    height: 14px;
    line-height: 14px;
    padding: 0 4px;
    top: 3px;
  }
}

.bread_container {
  /deep/.el-breadcrumb__separator {
    margin: 0 5px;
    font-weight: 500;
    color: #606266;
  }
}
.country-icon {
  width: 40px;
  margin: 3px 0 0 0;
  border-radius: 4px;
}
.country-icon-1 {
  width: 27px;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 0 -4px 0;
}
#app {
  /deep/ .el-notification .right {
    z-index: 0 !important;
  }
}
</style>
