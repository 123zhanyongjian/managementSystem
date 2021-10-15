<template>
  <div>
    <template v-if="type !== 'zoom'">
      <template v-if="label === '导出'">
        <div
          class="btnGroup"
          :class="className === 'group' ? 'groupStyle' : ''"
        >
          <el-dropdown
            placement="bottom"
            :class="theme === 'dark' && 'darkImgStyle'"
            @command="handleCommand"
          >
            <div class="btnExportImg">
              <img :src="icon">
            </div>
            <div class="btnLabel">{{ label }}</div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="xml">xml</el-dropdown-item>
              <el-dropdown-item command="svg">svg</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <template v-else-if="label=== '对齐'">
        <div
          class="btnGroup"
          :class="className === 'group' ? 'groupStyle' : ''"
        >
          <el-dropdown
            placement="bottom"
            :class="theme === 'dark' && 'darkImgStyle'"
            @command="handleAlign"
          >
            <div class="btnExportImg">
              <img :src="icon">
              <div
                class="commonTriangleImg"
                :class="theme === 'dark' ? 'triangleImgDark' : 'triangleImg'"
              />
            </div>
            <div class="btnLabel">{{ label }}</div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in alignData"
                :key="index"
                :command="item.type"
              >
                <img :src="item.icon">
                <span style="margin-left: 10px;">{{ item.name }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <div
        v-else
        class="btnGroup"
        :class="className === 'group' ? 'groupStyle' : ''"
        @click="handleItem(type)"
      >
        <div class="btnImg">
          <img :src="icon">
        </div>
        <div class="btnLabel">{{ label }}</div>
      </div>
    </template>
    <template v-else>
      <div
        class="btnZoomGroup"
        :class="theme === 'dark' && 'zoomGroupDark'"
      >
        <el-tooltip
          effect="light"
          content="缩小视图"
        >
          <el-button
            size="mini"
            :disabled="defaultZoom < 0.2"
            icon="el-icon-zoom-out"
            :class="theme === 'dark' ? 'btnScaleStyleDark' : 'btnScaleStyle'"
            @click="handleItem('narrow')"
          />
        </el-tooltip>
        <el-select
          v-model="viewSizeValues"
          size="mini"
          :class="theme === 'dark' && 'btnSelectStyleDark'"
          @change="handleItem('stretch', viewSizeValues)"
        >
          <el-option
            v-for="(item, index) in viewSizeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tooltip
          effect="light"
          content="放大视图"
        >
          <el-button
            size="mini"
            :disabled="defaultZoom > 4"
            :class="theme === 'dark' ? 'btnScaleStyleDark' : 'btnScaleStyle'"
            icon="el-icon-zoom-in"
            @click="handleItem('enlarge')"
          />
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="重置视图并居中"
        >
          <el-button
            size="mini"
            :class="theme === 'dark' ? 'btnScaleStyleDark' : 'btnScaleStyle'"
            style="margin-left: 0px;"
            icon="el-icon-c-scale-to-original"
            @click="handleItem('zoomCenter')"
          />
        </el-tooltip>
      </div>
      <div class="btnLabel">{{ label }}</div>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
import leftImg from './img/left.png'
import rightImg from './img/right.png'
import topImg from './img/top.png'
import bottomImg from './img/bottom.png'
import horizontallyImg from './img/horizontally.png'
import verticalCenterImg from './img/verticalCenter.png'
import leftWImg from './img/leftW.png'
import rightWImg from './img/rightW.png'
import topWImg from './img/topW.png'
import bottomWImg from './img/bottomW.png'
import horizontallyWImg from './img/horizontallyW.png'
import verticalCenterWImg from './img/verticalCenterW.png'
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    defaultZoom: {
      type: Number,
      default: 1
    },
    className: {
      type: String,
      default: ''
    },
    globalTheme: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      viewSizeOptions: [{
        label: '100%',
        value: 1
      },
      {
        label: '150%',
        value: 1.5
      },
      {
        label: '300%',
        value: 3
      }],
      viewSizeValues: 1,
      theme: '',
      alignData: [
        {
          type: 'left',
          icon: this.globalTheme === 'dark' ? leftImg : leftWImg,
          name: '左对齐'
        },
        {
          type: 'middle',
          icon: this.globalTheme === 'dark' ? verticalCenterImg : verticalCenterWImg,
          name: '垂直居中'
        },
        {
          type: 'right',
          icon: this.globalTheme === 'dark' ? rightImg : rightWImg,
          name: '右对齐'
        },
        {
          type: 'top',
          icon: this.globalTheme === 'dark' ? topImg : topWImg,
          name: '上对齐'
        },
        {
          type: 'center',
          icon: this.globalTheme === 'dark' ? horizontallyImg : horizontallyWImg,
          name: '水平居中'
        },
        {
          type: 'bottom',
          icon: this.globalTheme === 'dark' ? bottomImg : bottomWImg,
          name: '下对齐'
        },
      ]
    }
  },
  watch: {
    defaultZoom: {
      handler(newVal, oldVal) {
        this.viewSizeValues = Math.floor(newVal * 10 * 10) + "%"
      }
    }
  },
  mounted() {
    this.theme = localStorage.theme ? 'dark' : 'white';
  },
  methods: {
    handleItem(type, value) {
      this.$emit('handleReturn', type, value)
    },
    handleCommand(command) {
      this.$emit('handleExport', command)
    },
    handleAlign(command) {
      this.$emit('handleAlign', command)
    }
  }
}
</script>

<style lang="less">
.btnGroup {
  width: 70px;
  margin-top: 5px;
  // margin-right: 7px;
  text-align: center;
  .btnImg {
    width: 22px;
    height: 22px;
    margin-left: 22px;
  }
  .btnImg:hover,
  .btnExportImg:hover {
    transform: scale(1.2, 1.2);
  }
  .btnExportImg {
    width: 22px;
    height: 22px;
    display: flex;
    .commonTriangleImg {
      margin-left: 12px;
      margin-top: 10px;
      width: 0px;
      height: 0px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
    }

    .triangleImg {
      border-top: 6px solid rgba(0, 0, 0, 0.6);
    }
    .triangleImgDark {
      border-top: 6px solid rgba(255, 255, 255, 0.6);
    }
  }
  .darkImgStyle {
    color: #ffffff;
  }
  .btnLabel {
    margin-top: 4px;
    font-size: 12px;
    line-height: 24px;
  }
}
.btnLabel {
  margin-top: 4px;
  font-size: 12px;
}
.groupStyle {
  margin-left: 30px;
}

.zoomGroupDark {
  .el-icon-zoom-out,
  .el-icon-zoom-in,
  .el-icon-c-scale-to-original {
    color: #ffffff;
  }
  .btnSelectStyleDark {
    input {
      background: #292929;
      border-color: #434343;
    }
  }
}

.btnZoomGroup {
  width: 230px;
  display: flex;
  margin: 3px 10px 0px 30px;
  text-align: center;
  border-radius: 0px 2px 2px 0px;
  .el-input--mini .el-input__inner {
    height: 30px;
  }
  .el-button--mini {
    height: 30px;
  }
  .el-input--mini .el-input__icon {
    line-height: 1.75rem;
  }
  .el-button:focus,
  .el-button:hover {
    color: #00b8a4;
  }
  .btnScaleStyle {
    // background: #292929;
    background: #f6f8fa;
    // color: white;
    // border-color: rgb(121, 119, 119);
    border-color: rgb(187, 184, 184);
  }
  .btnScaleStyleDark {
    background: #292929;
    border-color: #434343;
  }
  .btnLabel {
    margin-top: 4px;
    font-size: 12px;
  }
}
</style>
