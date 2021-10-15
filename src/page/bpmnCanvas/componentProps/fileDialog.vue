<template>
  <div class="canvasFileDialog">
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="cellMethodStyle"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDbClick"
    >
      <el-table-column
        prop="name"
        :label="$t('文件名')"
      >
        <template slot-scope="scope">
          <img
            width="32px"
            :src="scope.row.nodeType === 0 ? fileSrc : folderSrc"
            alt=""
          >
          <span style="margin-left: 15px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        :label="$t('更新时间')"
      />
    </el-table>
  </div>
</template>

<script>
import * as fileAPI from '@/api/materialLibrary/file';
export default {
  name: 'FileDialog',
  data() {
    return {
      tableData: [],
      fileSrc: localStorage.theme ? require('@/page/materialLibrary/file/img/files1.png') : require('@/page/materialLibrary/file/img/fies.png'),
      folderSrc: localStorage.theme ? require('@/assets/img/file.png') : require('@/assets/img/files.png')
    }
  },
  mounted() {
    // 初始化获取文件列表
    const obj = {
      pageNumber: 1,
      pageSize: 99999
    }
    this.initFileInfo(obj);
  },
  methods: {
    initFileInfo(obj) {
      fileAPI.page(obj).then(res => {
        if (res.success) {
          const fileData = res.data.filter(item => item.nodeType === 0);
          const folderData = res.data.filter(item => item.nodeType === 1);
          this.tableData = folderData.concat(fileData);
        }
      })
    },

    // 将更新时间列居中展示
    cellMethodStyle({ columnIndex }) {
      if (columnIndex === 1) {
        return {
          textAlign: 'center'
        }
      }
    },

    // 单击表格某一行 1：文件夹  0：文件
    handleCellClick(row) {
      if (row.nodeType === 1) return;
      this.$emit('returnFileInfo', row)
    },

    // 双击表格某一行
    handleCellDbClick(row) {
      if (row.nodeType === 0) return;
      const obj = {
        pageNumber: 1,
        pageSize: 99999,
        parentId: row.id
      }
      this.initFileInfo(obj);
    }
  }
}
</script>

<style lang="less">
.canvasFileDialog {
  .el-table__header-wrapper {
    height: 40px;
    margin-top: 4px;
  }
  margin-top: -15px;
  .el-table th,
  .el-table tr {
    height: 22px;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
    height: 22px;
  }
  .el-table,
  .el-table__expanded-cell,
  .el-table th {
    div {
      // font-size: 12px;
      // margin-bottom: 1px;
    }
  }
}
</style>
