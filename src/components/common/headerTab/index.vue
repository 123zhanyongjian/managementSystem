<template>
  <div id="headerTab">
    <div class="tabTiyle">{{ titles }}</div>
    <div style="padding: 20px 0 0 20px;text-align: left">
      <el-button v-for="(item,index) in Hbtns" :key="index" style="margin-bottom: 15px;margin-left: 0;margin-right: 15px" @click="viewBtn(item)">{{ item.label }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderTab',
  props: {
    titles: {
      type: String,
      default: ''
    }, // title
    hbtns: {
      type: Array,
      default: () => []
    } // 数据列表
  },
  data() {
    return {
      tabPosition: ''
    }
  },
  methods: {
    viewBtn(v) {
      this.$emit('tabBtn', v)
    }
  }
}
</script>

<style lang="scss">
    #headerTab {
        background: white;
        padding: 20px;
        padding-left: 0;
        margin-bottom: 20px;

        .tabTiyle {
            border-left: 8px solid rgba(36, 145, 255, 1);
            padding-left: 15px;
            font-size: 21px;
            text-align: left;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.87);
        }
        .el-radio-button--medium .el-radio-button__inner{
            margin-right: 45px;
            margin-top: 20px;
            border: 1px solid #DCDFE6;
             -webkit-box-shadow: 0 0 0 0 #409EFF;
            box-shadow: 0 0 0 0 #409EFF;
            border-radius: 4px;
        }
        .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled){
            -webkit-box-shadow: 0 0 0 0 #409EFF;
            box-shadow: 0 0 0 0 #409EFF;
        }
        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
            background: white;
            color:rgba(74,144,226,1);
            border:1px solid rgba(74,144,226,1);
        }
    }
</style>
