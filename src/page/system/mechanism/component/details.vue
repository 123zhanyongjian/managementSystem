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
            {{ (formDatas[item.value]) +((item.unit?item.unit:'')) }}

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
      List: [
        {
          label: '机构编码',
          value: 'code'
        },
        {
          label: '机构名称',
          value: 'name'
        },
        {
          label: '上级机构',
          value: 'modelName'
        },
        {
          label: '机构层级',
          value: 'dept'
        },
        {
          label: '主要业务',
          value: 'majorBusiness'
        },
        {
          label: '负责人',
          value: 'owner'
        },
        {
          label: '手机号码',
          value: 'phoneNumber'
        },
        {
          label: '邮箱',
          value: 'email'
        },
        // {
        //   label: '地址',
        //   value: 'address'

        // },
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
    // overflow-y: scroll;
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
        height: 46px;
        font-size: 14px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.6);
        line-height: 46px;
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
