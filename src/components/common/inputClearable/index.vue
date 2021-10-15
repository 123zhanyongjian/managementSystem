<template>
  <el-input
    v-model="name"
    :placeholder="$t('请选择')"
    clearable
    :disabled="disabled"
    :readonly="readonly"
    @clear="clearCondition()"
    @focus="onFocus('input')"
  >
    <span v-if="!name && !disabled" slot="suffix" class="el-icon-search" @click="onFocus('icon')" />
  </el-input>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: function() {
        return ''
      }
    },
    disabled: {
      type: [Boolean, Function],
      default: function() {
        return false
      }
    },
    readonly: {
      type: Boolean
    },
    prompt: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      name: ''
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.name = val
      }
    },
    name: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    clearCondition() {
      this.$emit('clear')
    },
    onFocus(type) {
      // if (this.readonly) {
      //   this.$message({
      //     message: this.$i18n.tc(this.prompt),
      //     type: 'warning'
      //   })
      //   return
      // }
      this.$emit('click', type)
    }
  }
}
</script>
