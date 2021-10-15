<template>
  <el-dialog
    :title="$t('角色分配')"
    :visible.sync="treeShow"
    width="39.58%"
    :close-on-click-modal="false"
    class="userTree"
    :before-close="handleClose"
  >
    <div class="names">
      <img
        :src="headerImgs"
        alt=""
      >
      {{ userName }}
    </div>
    <div>
      <p class="roleInfo">{{ $t('员工角色') }}</p>
      <div class="line" />
    </div>
    <el-row :gutter="24" class="jurisdiction">
      <el-checkbox-group v-model="checkList" @change="change">
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
    <div class="operate">
      <span class="cancel cursor" size="small" @click="handleClose">{{ $t('取消') }}</span>
      <!-- <el-button type="primary" plain size="small" @click="handleReset">{{ $t('重置') }}</el-button> -->
      <el-button type="primary" size="small" @click="save()">{{ $t('确认') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { headerImgs } from '../icon'
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
    },
    userName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headerImgs,
      data: [],
      checkList: []
    }
  },
  created() {
    this.getData(1, 1000)
    this.checkList = this.checkArray
  },
  methods: {
    change(v) {
      // 单选
      this.checkList = [v[v.length - 1]]
    },
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

span {
  font-size: 26px;
}
.userTree {
    .roleInfo{
height: 20px;
font-size: 14px;
opacity:.4;
font-family: PingFangSCSemibold-, PingFangSCSemibold;
font-weight: normal;
color: #000000;
text-align: left;
line-height: 20px;
// border-bottom: 1px solid rgba(0,0,0,.63);
    }
  .names {
    text-align: left;
    margin-top: 25px;
    padding-bottom: 25px;

    font-weight: 700;
    >img{
        margin-right:17px;
        width: 40px;
    }
  }
  .operate{
      right: 45px;
  }
  .fill{
      width:100%;
      height:100px
  }
}
.white {
  .userTree {
    .names,.roleInfo {
      color: #000;
    }
    .treeClass {
      border: 1px solid rgb(217, 217, 217);
    }
    .line{
        height: 1px;
        margin-top: 10px;
        width: 100%;
        background: rgba(0, 0, 0, .2);

    }
  }
}
.dark {
  .userTree {
    .names,.roleInfo{
      color: #fff;
    }
    .treeClass {
      border: 1px solid #444;
    }
  }
  .line{
        height: 1px;
        margin-top: 10px;
        width: 100%;
        background: rgba(255, 255, 255, .2);

    }
}
</style>
<style lang="less">
.userTree {
    .el-dialog{
        height: 720px;
    }
  .el-dialog__body {
    padding: 0 44px;
  }
  .el-checkbox-group{
      margin-top: 29px;
      >div{
          text-align: left;
      }
  }
}
</style>

