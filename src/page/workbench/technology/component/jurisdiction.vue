<template>
  <el-dialog
    :title="$t('角色分配')"
    :visible.sync="treeShow"
    width="39.58%"
    :close-on-click-modal="false"
    class="icons"
    :before-close="handleClose"
  >
    <el-row :gutter="24" class="jurisdiction">
      <el-checkbox-group v-model="checkList">
        <el-col
          v-for="(item,index) in data"
          :key="index"

          style="margin-top:10px"
          :xl=" 6"
          :lg=" 6"
          :md=" 6"
          :sm=" 6"
        >
          <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>

        </el-col>
      </el-checkbox-group>
    </el-row>
    <el-button type="primary" @click="save">{{ $t('确认') }}</el-button>
  </el-dialog>
</template>
<script>
import * as _api from '@/api/system/role'
export default {
  props: {
    treeShow: {
      type: Boolean,
      default: true
    },
    checkArray: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: [],
      checkList: []
    }
  },
  created() {
    this.getData(1, 1000)
    this.checkList = this.checkArray
  },
  methods: {
    getData(pageNumber, pageSize) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize
      }
      _api.page(obj)
        .then(res => {
          this.data = res.data
        //   this.tableOptions.loading = false
        })
    },
    handleClose() {
      this.$parent.checkArray = []
      this.$emit('update:treeShow', false)
    },
    save() {
      this.$parent.checkArray = []
      // 获取所有选中的节点
      this.$emit('save', this.checkList)
    }
  }
}
</script>
<style lang="less" scoped>
span{
    font-size: 26px;
}
.jurisdiction{
    height: 45vh;
}
</style>
