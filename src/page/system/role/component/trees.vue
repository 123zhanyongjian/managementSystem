<template>
  <el-dialog
    :title="$t('权限设置')"
    :visible.sync="treeShow"
    width="39.58%"
    :close-on-click-modal="false"
    class="roleTree"
    :before-close="handleClose"
  >
    <div class="names">
      <img
        :src="headerImgs"
        alt=""
      >
      {{ $t('角色名称')+":"+ roleName }}
    </div>
    <el-row :gutter="24">
      <el-col
        style="margin-top:10px"
        :xl=" 24"
        :lg=" 24"
        :md=" 24"
        :sm=" 24"
      >
        <el-tree
          ref="tree"
          class="treeClass"
          :data="data"
          show-checkbox
          node-key="id"
          :props="{label:'name'}"
          :default-expanded-keys="checkArray"
          :default-checked-keys="checkArray"
        />

      </el-col>
    </el-row>
    <div class="fill" />
    <div class="operate">
      <span class="cancel cursor" size="small" @click="handleClose">{{ $t('取消') }}</span>
      <!-- <el-button type="primary" plain size="small" @click="handleReset">{{ $t('重置') }}</el-button> -->
      <el-button type="primary" size="small" @click="save()">{{ $t('确认') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as _api from '@/api/system/resource'
import { headerImgs } from '../icon'
export default {
  props: {
    treeShow: {
      type: Boolean,
      default: true
    },
    roleName: {
      type: String,
      default: ''
    },
    checkArray: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headerImgs,
      data: [],
      currentNodeKey: []
    }
  },
  created() {
    this.getData(1, 100)
  },
  methods: {
    getData(pageNumber, pageSize) {
      const obj = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        parentId: '0'
      }
      _api.tree(obj).then((res) => {
        this.data = res.data
        res.data
          .map((ite) => ite.id)
          .map((item, index) => {
            for (const i in this.checkArray) {
              if (this.checkArray[i] === item) {
                this.checkArray.splice(i, 1)
              }
            }
          })
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
      const arr = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
      this.$emit('save', arr)
    }
  }
}
</script>
<style lang="less" scoped>
  .treeClass {
    //   border: 1px solid rgb(217, 217, 217);
      overflow: scroll;
    }
span {
  font-size: 26px;
}
.roleTree {
  .names {
    text-align: left;
    margin-top: -10px;
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
  .roleTree {
    .names {
      color: #000;
    }
    .treeClass {
      border: 1px solid rgb(217, 217, 217);
      overflow: scroll;
    }
  }
}
.dark {
  .roleTree {
    .names{
      color: #fff;
    }
    .treeClass {
      border: 1px solid #444;
    }
  }
}
</style>
<style lang="less">
.roleTree {
  .el-dialog__body {
    padding: 0 44px;
  }
}
</style>
