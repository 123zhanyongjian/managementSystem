<template>
  <el-dialog
    :visible.sync="viewShow"
    width="83.3%"
    top="0vh"
    :close-on-click-modal="false"
    custom-class="viewProcess"
    :before-close="handleClose"
  >
    <span slot="title" style="font-size:20px"> <img width="16px" style="margin-right:10px" src="../img/views.png" alt="">{{ $t(title) }}</span>

    <el-row :gutter="24" class="jurisdiction">
      <div style="background-color: #f6f8fa">
        <img :src="srcUrl" alt="">
      </div>
    </el-row>
    <el-button size="mini" class="editbj" type="primary" @click="save">{{ $t('编辑') }}</el-button>
  </el-dialog>
</template>
<script>
import * as _api from '@/api/system/role'
export default {
  props: {
    viewShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    srcUrl: {
      type: String,
      default: ''
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
      this.$emit('update:viewShow', false)
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
    height: 70vh;
    overflow: hidden;
    >div{
        height: 100%;
        overflow-x:hidden;
        overflow-y: scroll;
         img{
        transform: scale(.8);

    }
    }

}
.editbj{
   position: absolute;
    right: 118px;
    top: 15px;
    width: 102px;
    height: 50px;
    font-size: 16px;

}

</style>
<style lang="less">
.technology{
.viewProcess{
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
}
}
</style>
