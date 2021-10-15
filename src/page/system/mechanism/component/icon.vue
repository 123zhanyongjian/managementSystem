<template>
  <el-dialog
    :title="$t('图标')"
    :visible.sync="iconShow"
    :close-on-click-modal="false"
    width="39.58%"
    class="icons"
    :before-close="handleClose"
  >
    <el-button type="primary" size="mini" @click="choice('')">{{ $t('清空') }}</el-button>
    <el-row :gutter="24">
      <el-col
        v-for="(item,index) in icon"
        :key="index"
        style="margin-top:10px"
        :xl=" 4"
        :lg=" 4"
        :md=" 4"
        :sm=" 4"
      >
        <img class="icon_span cursor" :src="item.value" @click="choice(item)">
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { iconList } from '@/utils/lefticon'
export default {
  props: {
    iconShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      icon: iconList
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:iconShow', false)
    },
    choice(item) {
      this.$parent.formData.icon = item.label
      this.$emit('update:iconShow', false)
    }
  }
}
</script>
<style lang="less" scoped>
span{
    font-size: 26px;
}
.icon_span{
    width: 32px !important;
}
</style>
