<template>
  <el-dialog
    :title="state===1?$t('移动到'):$t('复制到')"
    :visible.sync="treeShow"
    width="39.58%"
    :close-on-click-modal="false"
    class="iconsTree"
    :before-close="handleClose"
  >
    <el-row :gutter="24" class="treeClass">
      <el-col

        style="margin-top:10px"
        :xl=" 24"
        :lg=" 24"
        :md=" 24"
        :sm=" 24"
      >
        <el-tree
          ref="tree"
          :data="data"
          lazy
          :load="load"
          show-checkbox
          node-key="id"
          :props="{label:'name',isLeaf: (data, node) => {
            if(data.childCount === '0') {
              return true
            }
          },}"
          :default-expanded-keys="checkArray"
          :default-checked-keys="checkArray"
        >
          <span
            slot-scope="{ node }"
            class="custom-tree-node"
          >
            <span style="font-size:14px;display:inline-block">
              <img
                width="24px"
                style="margin-left:8px;margin-right:16px"
                src="../img/iconfile.png"
                alt=""
              >{{ node.label }}
            </span>
            <!-- <el-input v-model="node.label" /> -->
          </span>
        </el-tree>

      </el-col>
    </el-row>
    <div style="height:38px;width:100%;opacity:0;margin-top:20px" />
    <el-button
      type="primary"
      class="new_Button btn_files"
      size="small"
      @click="newButton"
    ><img
       :src="addimg"
       class="imgicon"
       style=""
       alt=""
     >
      {{ $t('新建工艺集') }}</el-button>
    <div class="operate">

      <span
        class="cancel cursor"
        size="small"
        @click="handleClose"
      >{{ $t('取消') }}</span>
      <el-button
        type="primary"
        size="small"
        @click="save()"
      >{{ $t('保存') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as _api from '@/api/technology'
import { mapGetters } from 'vuex'
import {

  addimg
} from '../icon'
export default {
  props: {
    treeShow: {
      type: Boolean,
      default: true
    },
    id: {
      type: [String, Number],
      default: ''
    },
    state: {
      type: Number, // 1 移动 2 复制
      default: 1
    },
    checkArray: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: [],
      addimg,
      currentNodeKey: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getData(1, 100)
  },
  methods: {
    getData(pageNumber, pageSize, parentId, lazy) {
      return new Promise(resovle => {
        const obj = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          parentId
        }
        _api.page(obj).then((res) => {
          if (lazy) {
            resovle(res)
            return
          }
          //   .unshift({ id: '', nodeType: 1, childCount: '0', name: '我的' })
          //   this.tableOptions.loading = false
          res.data.unshift({ id: this.userInfo.id, nodeType: 1, childCount: '0', name: '我的' })
          this.data = res.data.filter(item => item.nodeType === 1)
        })
      })
    },
    handleClose() {
      this.$parent.$parent.checkArray = []
      this.$emit('update:treeShow', false)
    },
    save() {
      let method = _api.move
      if (this.state === 2) {
        // 复制
        method = _api.copy
      }
      method({
        id: this.id,
        targetParentId: this.$refs.tree.getCurrentKey()

      })
        .then(res => {
          this.$message.success(res.message);
          this.handleClose();
          this.$parent.$parent.getData(1, 999, this.$parent.$parent.breadcrumbList[this.$parent.$parent.breadcrumbList.length - 1].id)
        })
    },
    // 新建工艺集
    newButton() {
      this.$parent.$parent.processAddShow = true
      this.$parent.$parent.processAddState = 0
      this.$parent.$parent.processformData = {}
      this.$parent.$parent.checkTreeId = this.$refs.tree.getCurrentKey()
    },
    // 懒加载
    load(node, resovle) {
      // 防止开头触发，判断是否为一个数组,是的话阻止
      if (Array.isArray(node.data)) {
        return
      }
      this.getData(1, 9999, node.data.id, true)
        .then(res => {
          resovle(res.data.filter(item => item.nodeType === 1))
        })
    }
  }
}
</script>
<style lang="less" scoped>
span {
//   font-size: 26px;
}
.imgicon{
   width:16px;margin-right:5px
}
</style>
<style lang='less'>
.iconsTree {
      .custom-tree-node{
        span{
            font-size: 14px !important;
        }
    }
    .el-dialog__body {
    padding: 1.875rem 3.5rem;
    // overflow-y: scroll;
}
  .el-tree-node__content {
    height: auto !important;
  }
  .el-checkbox {
    display: none;
  }
  .el-tree-node__expand-icon {
    margin-top: 8px;
  }
  .el-tree-node:focus > .el-tree-node__content {
    background: transparent;
    color: #15dcc6;
  }
  .el-row {
    border: 1px solid rgb(68, 68, 68);
  }
  .operate {
    right: 6%;
  }
  .new_Button {
    position: absolute;
    left: 6%;
    bottom: 31px;
  }
}
</style>
