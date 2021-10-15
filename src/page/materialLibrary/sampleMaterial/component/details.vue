<template>
  <div class="sampleMaterialDetails">
    <el-dialog
      :title="$t('详情')"
      :visible.sync="detailsShow"
      :close-on-click-modal="false"
      width="39.58%"
      top="5vh"
      :before-close="handleClose"
    >
      <ul>
        <li
          v-for="(item,index) in List"
          :key="index"
          :class="index===0?'firstLi':''"
        >
          <p>{{ $t(item.label) }}</p>
          <p>
            {{ (formData[item.value]) +((item.unit?item.unit:'')) }}

          </p>
        </li>
      </ul>
      <el-button
        class="cursor"
        type="primary"
        @click="handleClose"
      >{{ $t('确认') }}</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    detailsShow: {
      type: Boolean,
      default: false
    },
    formDatas: {
      type: Object,
      default: () => {
        ''
      }
    }
  },
  data() {
    return {
      formData: {},
      List: [
        {
          label: '物料名称',
          value: 'materielName'
        },
        {
          label: '物料类',
          value: 'materielClass'
        },
        {
          label: '物料型号',
          value: 'modelName'
        },
        {
          label: '物料类型',
          value: 'materielType'
        },
        {
          label: '任务',
          value: 'taskName'
        },
        {
          label: '状态',
          value: 'status'
        },
        {
          label: '序列号',
          value: 'serialNumber'
        },
        {
          label: '物料容量',
          value: 'capacitys'
        },
        {
          label: '物料高度',
          value: 'height',
          unit: 'mm'
        },
        {
          label: '物料夹取高度',
          value: 'materielOffset',
          unit: 'mm'
        },
        {
          label: '物料运送速度',
          value: 'speed'
        },
        {
          label: '是否有盖',
          value: 'isHaveLid'
        },
        {
          label: '是否可盖盖子',
          value: 'isLid'
        },
        {
          label: '盖子夹取高度',
          value: 'lidOffset',
          unit: 'mm'
        },
        {
          label: '是否可封膜',
          value: 'isSeal'
        },
        {
          label: '添加人',
          value: 'createUserId'
        },
        {
          label: '添加时间',
          value: 'createTime'
        },
        {
          label: '描述',
          value: 'remark'
        }
      ]
    }
  },
  mounted() {
    if (this.formDatas.isLid === '否') {
      this.formDatas.isHaveLid = '否'
      this.formDatas.lidOffset = '0'
    }
    this.formData = { ...this.formDatas }
    Object.keys(this.formData).forEach(item => {
      for (const i of this.List) {
        // 如果带单位的 为空，默认为0
        if (i.value === item && i.unit && !this.formData[item]) {
          this.formData[item] = 0
        }
      }
      if (this.formData[item] !== 0) {
        this.formData[item] = this.formData[item] ? this.formData[item] + '' : ''
      }
    })
  },
  methods: {
    handleClose() {
      this.$emit('update:detailsShow', false)
    }
  }
}
</script>
<style lang="less">
.sampleMaterialDetails {
  .el-button {
    width: 260px;
    height: 50px;
    margin-top: 28px;
  }
  .el-dialog {
    // height: 840px;
  }
  .el-dialog__body {
   padding: 2rem 2rem 36px 2.1rem;
  }
  ul {
        width: 688px;
    padding-right: 20px;
    overflow-y: scroll;
    height: 560px;
    .firstLi{

          p{
                border-top: 1px solid rgba(0, 0, 0, 0.2) !important;
          }

}
    li {
      display: flex;

      p {
        flex: 1;
        border: 1px solid rgba(0, 0, 0, 0.2);
        height: 38px;
        font-size: 14px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.6);
        line-height: 38px;
        overflow: hidden;
        display: inline-block;
        // width:70%;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        //  margin-left: 62px;
      }
      p:nth-child(1) {
        border-right: none;
        padding: 0  0 0 62px;
      }
       p:nth-child(2) {
        padding: 0  0 0 102px;
      }
       p:nth-child(n+1){
          border-top: none;
      }
    }
  }
}
.dark {
  .sampleMaterialDetails {
              .firstLi{

          p{
                border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
          }

}
    p {
      color: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
