<template>
  <div class="systemMaterials">
    <div class="contents">
      <div class="form">
        <el-button
          type="primary"
          class="btn"
          @click="add"
        > <img
          src="./img/add.png"

          alt=""
        >{{ $t('新建物料类') }}</el-button>
      </div>
      <div v-if="idx===0" class="mainRight">
        <el-input
          v-model="modeVal"
          clearable
          :placeholder="$t('搜索')"
          class="input first"
          @input="watchList($event,1)"
        >
          <img
            slot="prefix"
            width="16px"
            :src="search"
          >
        </el-input>
      </div>
      <div v-if="idx===1" class="mainRight">
        <el-input
          v-model="styleCode"
          clearable
          :placeholder="$t('搜索')"
          class="input"
        >
          <img
            slot="prefix"
            width="16px"
            :src="search"
          >
        </el-input>
        <el-button
          type="primary"
          class="btn"
          @click="add"
        > <img
          src="./img/add.png"

          alt=""
        >{{ $t('添加') }}</el-button>
      </div>
      <div v-if="idx===2" class="mainRight">
        <el-input
          v-model="modelCode"
          clearable
          :placeholder="$t('搜索')"
          class="input"
        >
          <img
            slot="prefix"
            width="16px"
            :src="search"
          >
        </el-input>
        <el-button
          type="primary"
          class="btn"
          @click="add"
        > <img
          src="./img/add.png"

          alt=""
        >{{ $t('添加') }}</el-button>
      </div>
      <systemMaterials
        v-if="idx===0"
        ref="systemMaterials"
        :dialog-visible="addShow"
        :edit-state="editState"
        :form-data.sync="formDatas"
        :add-show.sync="addShow"
        @save="saves"
        @edit="edit"
        @initialObj="(v)=>initialObj=v"
      />
      <types v-if="idx===1" ref="type" :style-code="styleCode" />
      <modelMaterials v-if="idx===2" :model-code="modelCode" />
    </div>
  </div>
</template>
<script>
import systemMaterials from './SystemMaterial'
import { mapGetters } from 'vuex'
import types from './type'
import modelMaterials from './modelManagement'
import * as _apiType from '@/api/SystemMaterial/type'
import * as _apiMode from '@/api/SystemMaterial/modelManagement'
import * as _api from '@/api/SystemMaterial/SystemMaterial'
export const search = localStorage.theme
  ? require('./img/serachdark.png')
  : require('./img/serachWhite.png')
export default {
  components: {
    systemMaterials,
    modelMaterials,
    types
  },
  data() {
    return {
      initialObj: '',
      styleCode: '',
      modelCode: '',
      search,
      modeVal: '',
      idx: 0,
      name: '',
      typeVal: '',
      value1: '',
      searchForm: {},
      formDatas: {},
      modeList: [],
      typeList: [],
      addShow: false,
      editState: 0,
      btnList: [
        //   '系统物料库'
        //    '类型管理', '型号管理'
      ]

    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    // this.getList()
  },
  methods: {
    // 监听系统下拉变化
    watchList(v, r) {
      if (r) {
        this.modeVal = v
      } else {
        this.typeVal = v
      }

      // 获取子类data materielType modelName
      const data = this.$refs.systemMaterials;
      // 查询分页
      data.getData(data.pageVo.currentPage, 10, { searchWord: this.modeVal })
    },
    // 切换
    changeCheck(index) {
      this.idx = index
    },
    getList() {
      // 类型列表、
      _apiType.list({ userId: this.userInfo.id })
        .then(res => {
          this.typeList = res.data.map(ite => ({ label: ite.styleCode, value: ite.styleCode }))
        })
      _apiMode.list({ userId: this.userInfo.id })
        .then(res => {
          this.modeList = res.data.map(ite => ({ label: ite.modelCode, value: ite.modelCode }))
          console.log(this.modeList)
        })
    },
    // 保存
    save(obj) {
    //   if (this.editState === 0) {
    //     _api.add(obj).then((res) => {
    //       this.$message.success(res.message)
    //       this.getData()
    //       this.addShow = false
    //     })
    //     return
    //   }
    //   _api.update(obj).then((res) => {
    //     this.$message.success(res.message)
    //     this.getData()
    //     this.addShow = false
    //   })
    },
    add({ row }) {
      console.log(123)
      //   this.formDatas = Object.assign({}, row)
      this.editState = 0
      this.addShow = true
    },
    edit(row) {
      this.formDatas = Object.assign({}, row)
      this.formDatas.isSeal = String(this.formDatas.isSeal)
      this.formDatas.isLid = String(this.formDatas.isLid)
      this.formDatas.speed = String(this.formDatas.speed)
      this.formDatas.isHaveLid = this.formDatas.isHaveLid ? String(this.formDatas.isHaveLid) : ''
      const [m, n] = this.formDatas.capacity ? this.formDatas.capacity.split(',') : []
      this.$set(this.formDatas, 'm', m)
      this.$set(this.formDatas, 'n', n)
      this.addShow = true
      this.editState = 1
    },
    saves(obj) {
      obj.createUserId = this.userInfo.id
      if (this.editState === 0) {
        obj.createUserName = this.userInfo.user.nickName
        _api.add(obj).then((res) => {
          this.$message.success(res.message)
          this.$refs.systemMaterials.getData()
          this.addShow = false;
          this.formDatas = {}
        }, () => {
          this.formDatas = this.initialObj
        })
        return
      }
      obj.updateName = this.userInfo.user.nickName
      _api.update(obj).then((res) => {
        this.$message.success(res.message)
        this.$refs.systemMaterials.getData()
        this.addShow = false
        this.formDatas = {}
      }, () => {
        this.formDatas = this.initialObj
      })
    }

  }
}
</script>
<style lang="less" scoped>
.contents {
  overflow: hidden;
//   margin-top: 0px;
  .iptFirst {
    margin-left: 0 !important;
  }
  .form {
    float: left;
    // width: 70%;
  }
}
</style>

<style lang="less">
.systemMaterials {
       .headimg{
    height: 34px;
    width: 58px;
    border-radius: 3px;
}
    .mainRight{
    .el-input,
    .el-input--prefix {
      width: 226px;
      height: 38px;
      img {
        padding: 12px 15px;
      }
    }
      .el-input--prefix .el-input__inner {
      padding-left: 50px;
      height: 38px;
      vertical-align: top;
    }
    }
    .btn{
         font-size: 14px !important;
       ;height:38px;vertical-align:top;
        img{
            margin-right: 10px;
            width: 14px;

        }
    }
     .btn:hover{
         font-size: 14px;
     }
    .mainRight{
        float: right;
        .first{
            // margin-right: 10px;
        }
    }
    .el-button{
        font-size: 16px;
        padding:13px 15px 15px;
    }
  .form {
    text-align: left;
    .el-input,
    .el-input--prefix {
      width: 226px;
      vertical-align: middle;
      margin-left: 12px;
      height: 38px;
      img {
        padding: 12px 15px;
      }
    }
    .el-input--prefix .el-input__inner {
      padding-left: 50px;
      height: 38px;
      vertical-align: top;
    }
  }
}
.white {
  .systemMaterials {
    .btn_files {
      border: 1px solid #00b8a4;
    }
    input {
      background: #e6e6e9;
    }
    .unCheck{
        background: rgba(0, 0, 0, .06);
    }
  }
}
.dark {
  .systemMaterials {
       .btn_files {
      border: 1px solid #15DCC6;
;
    }
     .unCheck{
        background: rgba(255, 255, 255, 0.06);
        border: none;
        color: rgba(255, 255, 255, .8);
    }
  }
}
</style>
