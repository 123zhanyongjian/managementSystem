<template>
  <div class="attributeInfoStyle">
    <template v-for="(item, index) in form">
      <div
        :key="index"
        class="newAttributeForm"
      >
        <div class="attrLabel">{{ $t(item.name) || '-' }}</div>
        <div
          v-if="!item.isEnum"
          class="newProp"
        >
          {{ materialData[item.value] || '-' }}{{ item.suffix ? item.suffix : '' }}
        </div>
        <div
          v-else
          class="newProp"
        >
          {{ enumResult(item.value) }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Materialinfo',
  props: {
    materialNewData: {
      type: Object,
      default: () => { }
    },
    commonMaterialOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      materialData: {},
      form: [
        {
          name: '物料类',
          value: 'materielName'
        },
        {
          name: '物料型号',
          value: 'modelName'
        },
        {
          name: '物料类型',
          value: 'materielType'
        },
        {
          name: '物料容量',
          value: 'capacity'
        },
        {
          name: '物料高度',
          value: 'height',
          suffix: 'mm'
        },
        {
          name: '物料夹取高度',
          value: 'materielOffset',
          suffix: 'mm'
        },
        {
          name: '物料运送速度',
          value: 'speed',
          isEnum: true
        },
        {
          name: '是否有盖',
          value: 'isHaveLid',
          isEnum: true
        },
        {
          name: '是否可盖盖子',
          value: 'isLid',
          isEnum: true
        },
        {
          name: '是否可封膜',
          value: 'isSeal',
          isEnum: true
        },
        {
          name: '描述',
          value: 'remark'
        }
      ]
    }
  },
  computed: {
    enumResult() {
      return function (type) {
        if (type === 'speed') {
          return this.speed(this.materialData[type])
        } else {
          return this.nomallEnum(this.materialData[type])
        }
      }
    }
  },
  mounted() {
    this.materialData = this.commonMaterialOptions.filter(item => item.id === this.materialNewData.id)[0]
  },
  methods: {
    speed(value) {
      console.log(value)
      if (value === 0) return '快';
      if (value === 1) return '中';
      if (value === 2) return '慢';
    },
    nomallEnum(value) {
      if (value === 1) return '是';
      if (value === 0) return '否';
    }
  }
}
</script>

<style lang="less">
.attributeInfoStyle {
  padding-bottom: 65px;
  margin-top: 15px;
}
</style>
