<template>
  <div id="app" v-title data-title="实验流程设计系统" @click="handleClick">
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import * as canvasAPI from '@/api/canvas'
export default {
  name: 'App',
  computed: {
    ...mapGetters(['theme'])
  },
  created() {
    console.log(process.env)
  },
  mounted() {
    document.querySelector('body').className = this.theme ? 'dark' : 'white';
    // canvasAPI.componentQuery({}).then((res) => {
    //   if (res.success) {
    //     localStorage.setItem('paletteDataInfo', JSON.stringify(res.data))
    //     this.setpaletteData(res.data);
    //   }
    // });
  },
  methods: {
    ...mapActions(['setpaletteData']),
    handleClick(v) {
      // 关闭右键弹窗
      this.$bus.$emit('closeRightButton')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
