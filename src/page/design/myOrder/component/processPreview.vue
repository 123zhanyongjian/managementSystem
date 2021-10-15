<template>
  <div class="craft">
    <el-dialog
      :title="$t('工艺预览')"
      :visible.sync="craftShow"
      :close-on-click-modal="false"
      top="5vh"
      width="40.58%"
      :before-close="handleClose"
    >
      <div class="content">
        <div class="craft_left" />
        <div class="craft_right">

          <div class="information">
            <p class="right_title">工艺简介</p>
            <div class="information_s">
              <div class="info_title">工艺名称:</div>
              <div>username</div>
            </div>
            <div class="information_s">
              <div class="info_title">建立时间:</div>
              <div>2021-10-12</div>
            </div>
            <div class="information_s">
              <div class="info_title">所属功能岛:</div>
              <div>细菌培养</div>
            </div>
            <div class="information_s">
              <div class="info_title">配置版本:</div>
              <div>2.1.4.1</div>
            </div>
            <div class="border" />

            <p class="right_title">输入</p>
            <div class="information_s">
              <div class="info_title">提供内容:</div>
              <div>username</div>
            </div>
            <div class="information_s">
              <div class="info_title">建立时间:</div>
              <div>2021-10-12</div>
            </div>
            <div class="border" />

            <p class="right_title">输出</p>
            <div class="information_s">
              <div class="info_title">提供内容:</div>
              <div>username</div>
            </div>
            <div class="information_s">
              <div class="info_title">建立时间:</div>
              <div>2021-10-12</div>
            </div>
            <div class="border" />

            <p class="right_title">输出</p>
            <div class="information_s">
              <div class="info_title">提供内容:</div>
              <div>username</div>
            </div>
            <div class="information_s">
              <div class="info_title">建立时间:</div>
              <div>2021-10-12</div>
            </div>

          </div>
        </div>
      </div>

    </el-dialog>
  </div>
</template>
<script>
export default {

  props: {
    craftShow: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: function() {
        return {}
      }
    }

  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {

    handleClose() {
      this.$emit('update:craftShow', false)
    }

  }
}
</script>

<style lang="less">
.craft{
.el-dialog__body {
    padding: 30px 25px 60px 25px !important;

  }

  .information{
    margin-left: 25px;
    color: #fff;
    width: 80%;

  }
  .information_s{
   margin: 20px 0;
    text-align: left;
  }
  .content{
    height: 600px;
    width: 100%;
    display: flex;

    .craft_left{
      width: 55%;
      height: 100%;
      border: 1px solid;
      border-radius: 5px;
    }
    .craft_right{
      width: 44%;
      height: 100%;
      padding: 0 20px 0 30px;
      overflow-y: scroll;
    }
    .info_title{
      color: rgba(255, 255, 255, 0.6);
    }
    .right_title{
       color: white;
        margin-bottom: 5px;
        margin-top: 5px;
        text-align: left;
        font-weight: bold;
        font-size: 16px;
    }
    .border{
      border-top: 1px solid #fff;
      margin-bottom: 10px;
    }
  }

 .white{
    .information{
    margin-left: 25px;
    color: black;
    width: 80%;
  }
  .info_title{
      color: rgba(0, 0, 0, 0.6);
    }
  .right_title{
      color: black;
      margin-bottom: 5px;
      margin-top: 5px;
      text-align: left;
      font-size: 16px;
  }
  .border{
    border-top: 1px solid #ccc;
    margin-bottom: 15px;
  }
  }}

</style>
