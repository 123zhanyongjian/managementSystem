<template>
  <div class="layoutHome">
    <leftmenu />
    <div ref="menu_right" class="menu_right wflex el-scrollbar" :style="{left:sidebar.width+'rem'}">
      <head-nav />
      <!-- 左边标题 -->
      <h2 v-if="headTitle">{{ leftMenName }}</h2>
      <div ref="menu_content" :class="headTitle?'menu_content':'menu_content menu_contentnoTop'">

        <!--//:include="cachedViews :key="key""-->
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view />
          </keep-alive>
        </transition>

        <!-- <minus-button /> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import headNav from './headNav.vue'
import { removeToken } from '@/utils/auth' // get token from cookie
import leftmenu from './leftMenu.vue'
export default {
  components: {
    leftmenu,
    headNav
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'leftMenName',
      'cachedViews',
      'headTitle'

    ])
  },
  watch: {
    // 标题切换
    $route({ meta }) {
      this.$store.commit('ROUTER_LEFT', { nameEn: meta.titleEn, name: meta.title })
      this.$store.commit('BTN_PER', this.$route.path)
    }
  },
  mounted() {
    this.$store.commit('BTN_PER', this.$route.path)
    this.$store.commit('ROUTER_LEFT', { nameEn: this.$route.meta.titleEn, name: this.$route.meta.title })
    console.log(this.$route, 11111)
  },
  methods: {
    logout() {
      removeToken()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
.menu_content{
    margin-top: 28px;
}
.menu_contentnoTop{
    margin-top: 0 !important;
}
.layoutHome{
    //     position: relative;
    // height: 100vh;
    // max-width: 1920px;
    // text-align: center;
    // margin: auto;
}
</style>
