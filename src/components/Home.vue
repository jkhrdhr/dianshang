<template>
  <div>
    <el-button @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
