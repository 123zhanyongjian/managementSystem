<!--  -->
<template>
  <div style="margin-top:10px;text-align: left">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ $t('全选') }}</el-checkbox>
    <div style="margin: 15px 0;" />
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="item in cities" :key="item" style="padding-bottom: 15px;min-width: 120px" :label="$t(item)">{{ $t(item) }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      cities: [],
      citiesList: [],
      citiesleng: [],
      isIndeterminate: false
    }
  },
  created() {

  },
  mounted() {
    this.citiesList = this.columns
    for (const i in this.columns) {
      if (this.columns[i].prop !== 'ids' && this.columns[i].prop !== 'opeText') {
        this.cities.push(this.columns[i].label)
        this.citiesleng.push(this.columns[i].label)
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.citiesleng : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>
<style scoped>
</style>
