<template>
  <div class="sampleMaterialDetails">
    <el-dialog
      :title="$t('订单详情')"
      :visible.sync="detailsShow"
      :close-on-click-modal="false"
      width="80%"
      top="5vh"
      :before-close="handleClose"
    >
      <el-dialog
        width="80%"
        title="任务预览"
        :visible.sync="innerVisible"
        top="5vh"
        append-to-body
      >

        <div class="information_">
          <div class="information_s_">
            <div class="info_title">任务编号:</div>
            <div>username</div>
          </div>
          <div class="information_s_">
            <div class="info_title">任务名称:</div>
            <div>20211011858001</div>
          </div>
        </div>
        <div>
          <p class="entry">输入</p>
          <el-table :data="gridData" border style="width: 99%" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}">
            <el-table-column min-width="20%" property="date" label="日期" />
            <el-table-column min-width="20%" property="name" label="姓名" />
            <el-table-column min-width="20%" property="address" label="地址" />
            <el-table-column min-width="20%" property="date" label="日期" />
            <el-table-column min-width="20%" property="address" label="地址" />
          </el-table>

          <p class="entry">输出</p>
          <el-table :data="gridData" border style="width: 99%" :header-cell-style="{textAlign:'center'}" :cell-style="{textAlign:'center'}">
            <el-table-column min-width="20%" property="date" label="日期" />
            <el-table-column min-width="20%" property="name" label="姓名" />
            <el-table-column min-width="20%" property="address" label="地址" />
            <el-table-column min-width="40%" property="date" label="日期" />

          </el-table>
          <div class="popup_foot"> <el-button type="info" @click="close">关闭</el-button></div>

        </div>

      </el-dialog>

      <p class="info">基本信息 <img src="../img/user.png" alt=""></p>
      <div class="information">
        <div class="information_s">
          <div class="info_title">创建人:</div>
          <div>username</div>
        </div>
        <div class="information_s">
          <div class="info_title">订单号:</div>
          <div>20211011858001</div>
        </div>
        <div class="information_s">
          <div class="info_title">创建时间:</div>
          <div>2021.10.11 08:59</div>
        </div>
        <div class="information_s">

          <div class="info_title">备注:</div>
          <div>细胞扩散非常强</div>
        </div>

      </div>
      <p class="task">任务信息</p>
      <el-row :gutter="20">
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple" @click="task_info()">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
        <el-col :lg="{span:&quot;4-8&quot;}"><div class="grid-content bg-purple">bacteriaSample</div></el-col>
      </el-row>
      <p class="more">更多...</p>
      <p class="task_">审核流程</p>
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>

    </el-dialog>

  </div>
</template>
<script>

export default {
  props: {
    detailsShow: {
      type: Boolean,
      default: false
    }
    // formDatas: {
    //   type: Object,
    //   default: () => {
    //     ''
    //   }
    // }
  },
  data() {
    return {
      formData: {},

      taskShow: false,
      innerVisible: false,
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '结束',
        timestamp: '2018-04-13'
      }]

    }
  },
  mounted() {

  },
  methods: {
    close() {
      this.innerVisible = false
    },
    task_info() {
      this.innerVisible = true
    },
    handleClose() {
      this.$emit('update:detailsShow', false)
    }
  }
}
</script>

<style lang="less">
.sampleMaterialDetails{
  .el-table__header-wrapper, .el-table__fixed-right, .el-table__fixed {
    margin-top: 0 !important;
}
 .el-dialog__body {
   padding: 2rem 2rem 0px 2.1rem !important;
  }
}

.popup_foot{
  padding: 20px 0;
      display: flex;
    justify-content: flex-end;
    width: 99%;
}
.entry{
  color: white;
    margin-bottom: 5px;
    margin-top: 5px
}
.information_{

    display: flex;
    margin-left: 25px;
    color: #fff;
    width: 70%;
    flex-wrap: wrap;
  }
 .information_s_{
   margin: 10px 0;
    width: 25%;
    text-align: left;
  }

  .white{
     .information_{

    display: flex;
    margin-left: 25px;
    color: black;
    width: 70%;
    flex-wrap: wrap;
  }
  .entry{
  color: black;
    margin-bottom: 5px;
    margin-top: 5px
}
 .information_s_{
   margin: 10px 0;
    width: 25%;
    text-align: left;
  }
  }

.sampleMaterialDetails {

  .info_title{
    margin-bottom: 5px;
  }
  .el-button {
    width: 260px;
    height: 50px;
    margin-top: 28px;
  }
  .el-dialog {
    // height: 840px;
  }
 
  p{
    text-align: left;
    color: #fff;
  }
  .information{

    display: flex;
    margin-left: 25px;
    color: #fff;
    width: 70%;
    flex-wrap: wrap;
  }
  .information_s{
   margin: 10px 0;
    width: 25%;
    text-align: left;
  }
  .task{
    margin-top: 10px;

  }
  .task_{
    margin-top: 10px;
    margin-bottom: 15px;
  }
  .info{
    position: relative;
  }
  .info img{
    position: absolute;
    top: 25px;
    left: -2px;
    width: 17px;
  }
  .el-row {
    margin-bottom: 20px;

  }
  .el-col {
    border-radius: 4px;
  }
   .el-col-lg-4-8{
     width: 20%;
   }

  .bg-purple {
    background: rgba(50, 50, 50, 1);
  }
  .bg-purple:hover{
    background: #2F2F2F;
    box-shadow: 0px 0px 13px 0px rgba(8, 192, 169, 0.4);
    border: 1px solid rgba(8, 192, 169, 0.6);
    box-sizing: border-box;
  }

  .grid-content {
    border-radius: 4px;
    height: 100px;
    margin-top: 20px;
    line-height: 100px;
    color: #fff;
  }
  .more{
      text-align: right;
  }

 .el-timeline-item__wrapper{
   text-align: left;
 }
 .el-timeline-item__content{
   color:#fff
 }

}

.white{
.sampleMaterialDetails{
   .el-timeline-item__content{
   color:black
 }
  .bg-purple:hover{
    background: #FFFFFF;
    box-shadow: 0px 0px 13px 0px rgba(8, 192, 169, 0.4);
    border: 1px solid #00B8A4;
    box-sizing: border-box;
  }
 .more{
      text-align: right;
  }
  p{
    text-align: left;
    color: black;
    font-weight: 600;

  }
   .information{

    display: flex;
    margin-left: 25px;
    color: black;
    width: 70%;
    flex-wrap: wrap;
  }
  .grid-content {
    border-radius: 4px;
    height: 100px;
    margin-top: 20px;
    line-height: 100px;
    color: black;
  }
   .bg-purple {
    background: rgba(229, 231, 233, 1)
  }
    }
}

</style>
