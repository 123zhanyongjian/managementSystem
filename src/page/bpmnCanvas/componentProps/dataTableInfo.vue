<template>
  <div class="attributeInfoStyle">
    <div class="newAttributeForm">
      <div class="attrLabel">{{ $t('数据名称') }}</div>
      <div class="newProp">
        {{ dataInfo.name }}
      </div>
    </div>
    <div class="newAttributeForm">
      <div class="attrLabel">{{ $t('数据类') }}</div>
      <div class="newProp">
        {{ dataInfo.type }}
      </div>
    </div>
    <div class="newAttributeForm">
      <div class="attrLabel">{{ $t('尺寸') }}</div>
      <div class="newProp">
        {{ dataInfo.size }}
      </div>
    </div>
    <div class="newAttributeForm">
      <div class="attrLabel">{{ $t('初始值') }}</div>
      <div class="newProp">
        {{ dataInfo.value }}
      </div>
    </div>
    <div class="newAttributeForm">
      <div class="attrLabel">{{ $t('是否是输入') }}</div>
      <div class="newProp">
        {{ dataInfo.isInput }}
      </div>
    </div>
    <div class="newAttributeForm">
      <div class="attrLabel">{{ $t('是否是输出') }}</div>
      <div class="newProp">
        {{ dataInfo.isOutput }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    newData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      dataInfo: this.newData || {}
    }
  },
  watch: {
    newData: {
      handler(newVal) {
        this.dataInfo = newVal;
      }
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
