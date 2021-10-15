<template>
  <div id="tree">
    <el-input
      v-model="filterText"
      size="mini"
      clearable
      :placeholder="$t('输入关键字')"
    />
    <el-tree
      ref="tree"
      style="margin-top: 25px"
      :data="treeData"
      class="filter-tree"
      :props="defaultProps"
      :highlight-current="true"
      :node-key="defaultKeys.key"
      :default-expanded-keys="defaultKeys.defaultKey"
      accordion
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    treeData: {
      type: Array,
      default: function() {
        return []
      }
    }, // 数据列表
    defaultProps: {
      type: Object,
      default: function() {
        return {}
      }
    },
    defaultKeys: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    handleNodeClick(data) {
      console.log(data)
      if (data.children == null) {
        this.$emit('getAllData', data)
      }
    }
  }
}
</script>

<style lang="scss">
    #tree {
        padding: 25px;
        background: white;
        min-height: 80vh;
    }
</style>
