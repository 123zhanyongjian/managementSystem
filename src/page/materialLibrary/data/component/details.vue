<template>
  <div class="materDataDetails">
    <el-dialog
      :title="$t('详情')"
      :visible.sync="detailsShow"
      :close-on-click-modal="false"
      width="39.58%"

      :before-close="handleClose"
    >
      <ul>
        <li
          v-for="(item,index) in List"
          :key="index"
          :class="index===0?'firstLi':''"
        >
          <p>{{ $t(item.label) }}</p>
          <p>{{ (formDatas[item.value]||'') }}</p>
        </li>
      </ul>
      <el-button class="cursor" type="primary" @click="handleClose">{{ $t('确认') }}</el-button>
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
      List: [{
        label: '数据名称',
        value: 'name'
      }, {
        label: '数据类',
        value: 'dataTypeId'
      },
      {
        label: '任务',
        value: 'modelName'
      },
      {
        label: '状态',
        value: 'businessStatus'
      },
      {
        label: '添加时间',
        value: 'createTime'
      },
      {
        label: '描述',
        value: 'remark'
      },
      {
        label: '值',
        value: 'objectValue'
      }
      ]
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

.materDataDetails {
    .el-button{
        width: 260px;
        height: 50px;
        margin-top:28px;
    }
    .el-dialog{
        // height: 34.5rem
    }
    .el-dialog__body{
       padding: 2rem 2rem 36px 2.1rem;}
  ul {
       width: 688px;
    padding-right: 20px;
    // overflow-y: scroll;
// height: 21.5rem;
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
      p:nth-child(n+1){
          border-top: none;
      }
       p:nth-child(2) {

        padding: 0  0 0 102px;
      }
    }
  }
}
.dark {
    .materDataDetails{
                .firstLi{

          p{
                border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
          }

}
       p{
            color:rgba(255, 255, 255, .6);
        border: 1px solid rgba(255, 255, 255, .2);
       }
    }
}
</style>
