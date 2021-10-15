<template>
  <pl-table-column
    :label="$t(coloumnHeader.label)"
    :prop="coloumnHeader.label"
    align="center"
  >
    <template v-for="item in coloumnHeader.children">
      <tableColumn
        v-if="item.children && item.children.length"
        :key="item.id"
        :coloumn-header="item"
      />
      <pl-table-column
        v-else
        :key="item.name"
        :label="$t(item.label)"
        :prop="item.prop"
        :sortable="true"
        :width="item.width||160"
        :min-width="100"
        align="center"
      />
    </template>
  </pl-table-column>
</template>

<script>
import { PlTableColumn } from 'pl-table'
export default {
  name: 'TableColumn',
  components: {
    PlTableColumn
  },
  props: {
    coloumnHeader: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
