<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 查询输入框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input ref="getgoodsiptRef" v-model="getIndentitem.query" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="reasonNameGet"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表单区域 -->
      <el-table :data="indentLits" border style="width: 100%">
        <el-table-column type="index" label="#" width="70">
        </el-table-column>
        <el-table-column prop="order_number" label="订单标号" width="320">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="120">
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.is_send ==='0'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180">
          <template slot-scope="scope">
            {{scope.row.create_time | getTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="alterSite"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="定位" placement="top">
            <el-button type="success" size="small" icon="el-icon-location-outline" @click="logistics"></el-button>
          </el-tooltip>

        </el-table-column>
      </el-table>
      <!-- 分页导航栏 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[2,3,4,5]"
        :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="alterdialogVisible" width="50%" @close="addFromopen">
      <!-- 表单 -->
      <el-form :model="addressForm" :rules="rules" ref="addressForm" label-width="100px">
        <el-form-item label="省市区/县">
          <!-- 级联选择器 -->
          <el-cascader v-model="addressForm.consignee_addr" :options="citydata" :props="props" @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="consignee_addr2">
          <el-input v-model="addressForm.consignee_addr2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="logisticsVisible" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsVisible = false">取 消</el-button>
        <el-button type="primary" @click="logisticsVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import citydata from './citydata'
export default {
  data () {
    return {
      getIndentitem: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 总数
      total: 0,
      // 订单列表数据
      indentLits: [],
      // 修改地址对话框显示与隐藏
      alterdialogVisible: false,
      // 物流管理对话框的显示与隐藏
      logisticsVisible: false,
      // 修改地址表单绑定数据
      addressForm: {
        consignee_addr: [],
        consignee_addr2: ''
      },
      props: {
        expandTrigger: 'hover'
      },
      // 修改地址表单的验证
      rules: {
        consignee_addr2: [
          { required: true, message: '请输入完整内容', trigger: 'blur' }
        ]
      },
      citydata
    }
  },
  methods: {
    //     获取订单列表
    async getIndentList () {
      const { data: res } = await this.axios.get('orders', {
        params: this.getIndentitem
      })
      this.total = res.data.total
      this.indentLits = res.data.goods
      console.log(this.indentLits)
    },
    //     点击查询按钮事件
    reasonNameGet () {
      this.getIndentList()
    },
    //     页码大小变化的事件
    handleSizeChange (val) {
      console.log(val)
      this.getIndentitem.pagesize = val
      this.getIndentList()
    },
    //     当前页码变动触发的事件
    handleCurrentChange (val) {
      console.log(val)
      this.getIndentitem.pagenum = val
      this.getIndentList()
    },
    //     修改地址按钮事件
    alterSite () {
      this.alterdialogVisible = true
    },
    //     级联选则器结束事件
    handleChange () {

    },
    //     修改地址对话框关闭事件
    addFromopen () {
      this.$refs.addressForm.resetFields()
    },
    //     物流进度按钮事件
    logistics () {
      this.logisticsVisible = true
    }
  },
  created () {
    this.getIndentList()
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin: 20px 0;
}
.el-table {
  margin: 20px 0;
}
</style>
