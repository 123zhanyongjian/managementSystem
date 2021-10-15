<template>
  <el-dialog
    :visible.sync="viewShow"
    width="83.3%"
    top="0vh"
    :close-on-click-modal="false"
    custom-class="viewProcess"
    :before-close="handleClose"
  >
    <span
      slot="title"
      class="titles ellipsis"
      style="font-size:20px"
    >
      <img
        class="titleImg"
        style="margin-right:10px"
        :src="views"
        alt=""
      >{{ $t(title) }}
    </span>

    <el-row
      :gutter="24"
      class="jurisdiction"
    >
      <div
        id="imgDrag"
        style="background-color: #f6f8fa; overflow: scroll; width: 83vw"
      >
        <embed
          :src="craftInfo.nodeImageData"
          width="100%"
          type="image/svg+xml"
          pluginspage="http://www.adobe.com/svg/viewer/install/"
        >
      </div>
    </el-row>
    <el-button
      size="mini"
      class="editbj"
      type="primary"
      @click="save"
    >{{ $t('编辑') }}</el-button>
  </el-dialog>
</template>
<script>
const views = localStorage.theme
  ? require('@/assets/img/file1.png')
  : require('@/assets/img/file1s.png')
export default {
  props: {
    viewShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    srcUrl: {
      type: String,
      default: ''
    },
    craftInfo: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      views,
      data: [],
      checkList: [],
      styleObj: null, // 拖拽时修改图片的样式
      isDrag: false, // 是否开始拖拽
      startX: 0, // 鼠标的点击X轴
      startY: 0, // 鼠标的点击Y轴
      moveX: 0, // 鼠标移动的X轴
      moveY: 0, // 鼠标移动的Y轴
      endX: 0,
      endY: 0
    }
  },
  created() {
    this.checkList = this.checkArray
  },
  methods: {
    handleClose() {
      this.$parent.checkArray = []
      this.$emit('update:viewShow', false)
    },
    save() {
      this.$parent.checkArray = []
      this.$router.push({
        name: 'bpmnComp',
        params: {
          craftInfo: this.craftInfo,
          type: 'edit'
        }
      })
    },
    imgDragStart(e) {
      console.log('----e', e)
      // 当点击图片时，开始拖拽
      if (e.buttons) {
        this.isDrag = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.styleObj = `left:${this.endX}px;top:${this.endY}px`;
      }
    },
    imgDragStop() {
      this.isDrag = false;
      this.styleObj = `left:${this.endX}px;top:${this.endY}px`;
    },
    imgDragMove(e) {
      // 当鼠标拖拽图片的时候，才计算移动距离
      // 移动图片相对于父元素的位置
      if (this.isDrag) {
        console.log('移动', e, e.buttons)
        // 鼠标移动的距离
        this.moveX = e.clientX;
        this.moveY = e.clientY;
        // 相对页面的距离
        const x = this.moveX - this.startX;
        const y = this.moveY - this.startY;
        const img = document.querySelector('#imgDrag img');
        this.endX = img.offsetLeft + x;
        this.endY = img.offsetLeft + y;
        this.styleObj = `left:${this.endX}px;top:${this.endY}px`;
        this.styleObj = `left:${this.endX}px;top:${this.endY}px`;
        // 记录上次移动的距离
        this.startX = this.moveX;
        this.startY = this.moveY;
      }
    }
  }
}
</script>
<style lang="less" scoped>
.titleImg {
  width: 2rem;
}
.titles {
  display: inline-block;
  width: 80%;
  font-size: 20px !important;
}
/deep/ .el-dialog__body {
  padding: 4px 1.25rem;
}
span {
  font-size: 26px;
}
.jurisdiction {
  height: 70vh;
  position: relative;
  overflow: hidden;
  > div {
    height: 100%;
    overflow-x: scroll;
    overflow-y: scroll;
    img {
      cursor: pointer;
      transform: scale(0.8);
      width: 100%;
    }
  }
}
.editbj {
  position: absolute;
  right: 118px;
  top: 11px;
  width: 102px;
  height: 40px;
  font-size: 16px;
}
</style>
<style lang="less">
.technology {
}
.viewProcess {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .el-dialog__headerbtn {
    top: 19px !important;
  }
}
</style>
