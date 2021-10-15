<template>
  <div ref="menuTop" class="top_menu" :style="{width: topMenuWidth}">
    <el-scrollbar :vertical="false" class="scroll-container">
      <a
        v-for="(item,index) in topRouters"
        :key="index"
        class="top_menu_route"
        :class="path === item.path ? 'cur_menu' : 'menu'"
        @click="onClickTopMenu(item, index)"
      >
        <span v-if="item.meta && item.meta.title">
          <svg-icon class="leftmenu-svg-icon" :icon-class="item.meta.icon" />
          <span>{{ $t(`${item.meta.title}`) }}</span>
        </span>
      </a>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TopMen',
  computed: {
    ...mapGetters(['topRouters', 'leftRouter', 'topMenuWidth'])
  }
}
</script>
