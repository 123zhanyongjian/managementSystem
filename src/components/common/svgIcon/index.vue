<template>
  <div v-if="isExternal" class="" />
  <i v-else :class="svgClass" />
</template>

<script>
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    svgClass() {
      console.log(this.iconClass)
      if (this.iconClass) {
        return 'iconfont ' + this.iconClass
      } else {
        return 'iconfont'
      }
    }
  }
}
</script>

<style lang="less">

</style>
