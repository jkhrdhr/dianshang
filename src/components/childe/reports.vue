<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 为表准备的占位 -->
      <div id="main" style="width: 700px;height:500px;"></div>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }

    }
  },
  methods: {
    //   获取基于时间统计的折线图

  },
  created () {

  },
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    const myChart = this.$echarts.init(document.getElementById('main'))

    const { data: res } = await this.axios.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

    const newObj = Object.assign(this.options, res.data)

    myChart.setOption(newObj)
  }

}
</script>
<style lang="less" scoped>
.el-card {
  margin: 20px 0;
}
</style>
