<template>
  <div id="websiteContent">
    <base-dialog
      :title="$t('选择图标')"
      :visible.sync="dialogVisible"
      width="700px"
      center
    >
      <div class="box">
        <el-row :gutter="10">
          <el-col v-for="(item,index) in iconList" :key="index" :span="4">
            <div @click="onSubmit(item)">
              <svg-icon class="icon" :icon-class="item" />
            </div>
          </el-col>
        </el-row>
      </div>
    </base-dialog>
  </div>
</template>

<script>
import svgIcon from '@/components/svgIcon'
export default {
  name: 'IconTable',
  components: {
    svgIcon
  },
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      // 表格值集
      dataSource: [],
      iconList: [
        'icon-gonggao-miaobian',
        'icon-moxing-miaobian',
        'icon-dingwei',
        'icon-shezhi',
        'icon-qian-renminbi',
        'icon-dongtai-miaobian',
        'icon-suo',
        'icon-woderenwu',
        'icon-jiagou',
        'icon-kefu',
        'icon-xiaoxi',
        'icon-daojishi',
        'icon-gerenxinxi',
        'icon-shoucang',
        'icon-youhuiquan',
        'icon-morennvtouxiang',
        'icon-huoche',
        'icon-dahuoche--',
        'icon-xiaohuoche-pika',
        'icon-yundanguanli',
        'icon-yundanfahuotongji',
        'icon-yundanfenpei',
        'icon-yundanguanli1',
        'icon-gengduo-',
        'icon-quanburenwu',
        'icon-Fill',
        'icon-dingdan-dingdantiaodu',
        'icon-icon_huabanfuben',
        'icon-ic_image_upload'
      ]
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
  },
  methods: {
    // 提交
    onSubmit(val) {
      this.$emit('submit', val)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/    .el-dialog__body{
        padding: 0;
    }
/deep/  .el-dialog__header{
    margin-bottom: 0!important;
}
    .box{
        max-height:500px;
        overflow-y:auto;
        overflow-x:hidden;
        text-align:center;
    }
    .icon{
        font-size: 26px;
        padding: 20px 10px;
        display: block;
        cursor: pointer;
    }
    .icon:hover{
        color: #000;
        font-weight: bold;
    }
</style>
