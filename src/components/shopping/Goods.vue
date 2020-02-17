<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加用户区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input ref="getgoodsiptRef" placeholder="请输入内容" class="input-with-select" v-model="getgoodsName.query"
            clearable @clear='cleara'>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsById"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="addGoods">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsLits" border style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160">
          <template slot-scope="scope">
            {{scope.row.add_time | getTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 编辑按钮 -->
            <el-tooltip class="item" :enterable="false" effect="dark" content="编辑商品" placement="top-start">
              <el-button type="primary" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" :enterable="false" effect="dark" content="删除商品" placement="top-start">
              <el-button type="danger" icon="el-icon-delete" @click="deleteGood(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航栏 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30,40]"
        :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 删除商品对话框 -->
    <el-dialog title="提示" :visible.sync="deletedialogVisible" width="30%">
      <el-alert title="此操作将永久删除此商品，是否继续？" type="warning" :closable='false' show-icon>
      </el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletelist">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品列表数据
      goodsLits: [],
      //     查询商品绑定数据
      getgoodsName: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 列表总数
      total: 0,
      // 删除商品对话框显示与隐藏
      deletedialogVisible: false,
      // 要删除的商品id
      deleteId: ''
    }
  },
  methods: {
    //     获取商品列表数据
    async  getGoodslist () {
      const { data: res } = await this.axios.get('goods', {
        params: this.getgoodsName
      })
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsLits = res.data.goods
      this.total = res.data.total
    },
    //   查询商品按钮事件
    getGoodsById () {
      if (!this.$refs.getgoodsiptRef.value) {
        return this.$message.error('请输入内容')
      }
      this.getGoodslist()
    },
    //     页码大小改变事件
    handleSizeChange (val) {
      console.log(val)
      this.getgoodsName.pagesize = val
      this.getGoodslist()
    },
    //     页面变动事件
    handleCurrentChange (val) {
      console.log(val)
      this.getgoodsName.pagenum = val
      this.getGoodslist()
    },
    //     点击清空事件重新渲染页面数据
    cleara () {
      this.getgoodsName.query = ''
      this.getGoodslist()
    },
    //     删除商品按钮触发事件
    deleteGood (id) {
      this.deleteId = id
      this.deletedialogVisible = true
    },
    //     删除对话框的确定事件
    async deletelist () {
      const { data: res } = await this.axios.delete('goods/' + this.deleteId)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.deletedialogVisible = false
      this.getGoodslist()
    },
    // 添加商品按钮事件
    addGoods () {
      this.$router.push('goods/add')
    }
  },
  created () {
    this.getGoodslist()
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin: 20px 0;
}
</style>
