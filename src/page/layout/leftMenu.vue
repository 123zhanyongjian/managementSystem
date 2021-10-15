<template>
  <div class="menu_left cflex" :style="{width:sidebar.width+'rem'}">
    <!-- 折叠按钮 -->
    <!-- <div class="menu_page_top rflex">
      <span v-show="sidebar.opened" class="title" @click="$router.push({path: '/home/index'})">
        <img src="@/assets/logo1.png" width="150px" height="50px">
      </span>
      <span v-show="!sidebar.opened" class="title" @click="$router.push({path: '/home/index'})">
        <img src="@/assets/img/liufang-01.svg" width="45px" height="45px">
      </span>
    </div> -->
    <img v-if="!isCollapse" class="icon" :src="logo" alt="">
    <el-scrollbar>
      <div class="menu_page_bottom is-scroll-left">
        <el-menu
          mode="vertical"
          theme="dark"
          :show-timeout="200"
          :unique-opened="true"
          :default-active="$route.path"
          :collapse="isCollapse"
          :text-color="menuObj.textColor"
          :active-text-color="menuObj.activeTextColor"
          :style="{width:sidebar.width+'rem'}"
          @select="select"
        >
          <template v-for="(item,index) in leftRouter">
            <!-- 一级并且没有子菜单(静态的) -->
            <router-link
              v-if="!item.hidden && item.noDropdown"
              :key="index"
              :to="item.path+'/'+item.children[0].path"
            >
              <el-menu-item
                class="dropItem"
                :index="item.path+'/'+item.children[0].path"
              >
                <img width="24px" :src="getSrc(item.meta.icon)" alt="">

                <span v-if="item.meta.title" slot="title" class="title">{{ getCookies()? item.meta.titleEn:item.meta.title }}</span>
              </el-menu-item>
            </router-link>
            <!-- 一级并且没有子菜单(动态的) -->
            <router-link
              v-if="!item.hidden && !item.noDropdown && !item.children"
              :key="index"
              :to="getPath(item)"
            >
              <el-menu-item
                class="dropItems"
                :index="getPath(item)"
              >
                <img width="24px" :src="getSrc(item.meta.icon)" alt="">
                <span v-if="item.meta.title" slot="title" style="margin-left:13px" class="title titles">{{ getCookies()? item.meta.titleEn :item.meta.title }}</span>
              </el-menu-item>
            </router-link>
            <!-- 一级有子菜单 -->
            <el-submenu
              v-if="item.children && item.children.length >= 1 && !item.hidden && !item.noDropdown"
              :key="index"
              :index="getPath(item)"
            >
              <template slot="title">
                <img width="24px" :src="getSrc(item.meta.icon)" alt="">
                <span v-if="item.meta.title" slot="title" style="margin-left:13px" class="title titles">{{ getCookies()? item.meta.titleEn :item.meta.title }}</span>
              </template>
              <template v-for="(citem,cindex) in item.children">
                <!-- 二级并且没有子菜单 -->
                <router-link
                  v-if="!citem.hidden && !citem.children"
                  :key="cindex"
                  :to="getPath(item,citem)"
                  @click.native="getName(citem)"
                >
                  <el-menu-item
                    class="dropItem"
                    :index="getPath(item,citem)"
                  >
                    <img width="24px" :src="getSrc(citem.meta.icon)" alt="">
                    <span v-if="citem.meta.title" slot="title" style="margin-left:13px" class="title ">{{ getCookies()?citem.meta.titleEn:citem.meta.title }}</span>
                  </el-menu-item>
                </router-link>
                <!-- 二级有子菜单 -->
                <el-submenu
                  v-if="citem.children && citem.children.length >= 1 && !citem.hidden"
                  :key="cindex"
                  :index="citem.path"
                >
                  <template slot="title">
                    <img width="24px" :src="getSrc(citem.meta.icon)" alt="">
                    <span v-if="citem.meta.title" slot="title" style="margin-left:13px" class="title titles">{{ getCookies()?citem.meta.titleEn:citem.meta.title }}</span>
                  </template>
                  <!--直接定位到子路由上，子路由也可以实现导航功能-->
                  <!-- 三级并且没有子菜单 -->
                  <router-link
                    v-for="(kitem,kindex) in citem.children"
                    :key="kindex"
                    :to="getPath(item,citem,kitem)"
                  >
                    <el-menu-item
                      v-if="kitem.meta.routerType != 'topmenu' && kitem.meta.title && !kitem.hidden"
                      :index="getPath(item,citem,kitem)"
                    >
                      <img width="24px" :src="getSrc(kitem.meta.icon)" alt="">
                      <span slot="title" class="title titles" style="margin-left:13px">{{ getCookies()?kitem.meta.titleEn: kitem.meta.title }}</span>
                    </el-menu-item>
                  </router-link>
                </el-submenu>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { iconList } from '@/utils/lefticon'
import { getCookies } from '@/utils/auth'
export default {
  name: 'LeftMenu',
  data() {
    return {
    //   iconList,
      collapse: false,
      menuObj: {
        textColor: '#000',
        activeTextColor: '#fff'
      }
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'topRouterPath',
      'isCollapse',
      'sidebar',
      'leftRouter',
      'isTopMenu',
      'paletteData'
    ]),
    logo() {
      if (localStorage.theme) {
        return require('@/assets/logo1.png')
      }
      return require('@/assets/logoWhite.png')
    }
  },
  created() {
  },
  mounted() {
    this.$store.commit('BTN_PER', this.$route.path)
    this.menuObj = localStorage.theme ? {
      textColor: '#fff',
      activeTextColor: '#fff'
    } : {
      textColor: '#000',
      activeTextColor: '#00B8A4'
    }
  },
  methods: {
    getCookies() {
      return getCookies('LANG_6PL_E3') === 'en_US'
    },
    getSrc(val) {
      const src = iconList.filter(ite => ite.label === val)[0] ? iconList.filter(ite => ite.label === val)[0].value : ''
      return src
    },
    // 获取名称
    getName(item) {
      // 将名称作为标题
      this.$store.commit('BTN_PER', this.$route.path)
      this.$store.commit('ROUTER_LEFT', { nameEn: item.meta.titleEn, name: item.meta.title })
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      this.$store.dispatch('setLeftCollapse') // 折叠菜单
      this.$store.dispatch('handleLeftMenu') // 改变菜单宽度 180->35/35-180
    },
    getPath(item, citem, kitem) {
      if (citem && citem.path === 'bpmnCanvas/bpmn') {
        return `/bpmnComp/add`
      }
      if (citem && item.path === '/demo') {
        return `${item.path}/${citem.path}`
      }
      if (citem && !kitem) {
        return `${item.path}/${citem.path}`
      }
      if (citem && kitem) {
        return `${item.path}/${citem.path}/${kitem.path}`
      }
      return `${item.path}`
    },
    select(v, w) {
      // if (v === '/bpmnComp') {}
    }
  }
}
</script>
<style lang="less" scoped>
.dropItems{
    padding:0 27px !important;
}

@left-bgColor: #fff; // 左侧菜单背景颜色;
@icon-link: #ff6c60;
.menu_left{
    transition: width .5s;
    .el-menu-item,.dropItem{
        // padding-left: 40px !important;
    color: rgb(0, 184, 164) ;
    }
}
.title{
    font-size: 14px;
}
.titles{
    margin-left: 13px !important;
}
.menu_page_bottom {
  width: 100%;
  height: cala(100vh - 70px);
  padding-top: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  z-index: 10;
}
.svg-icon {
  margin-right: 10px;
}
</style>
<style lang="less">
.el-submenu__title{
    padding-left: 20px !important;
}
</style>
