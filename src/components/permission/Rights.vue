<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-table :data="rights" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop='authName'></el-table-column>
        <el-table-column label="路径" prop='path'></el-table-column>
        <el-table-column label="权限等级" prop='level'>
          <template slot-scope="aa">
            <el-tag v-if="aa.row.level==0">一级</el-tag>
            <el-tag v-else-if="aa.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      //     权限列表
      rights: []
    }
  },
  methods: {
    // 获取所有权限列表
    async getpermissionList () {
      const { data: res } = await this.axios.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rights = res.data
    }
  },
  created () {
    this.getpermissionList()
  }

}
</script>
<style lang="less" scoped>
.box-card {
  margin-top: 20px;
}
</style>
