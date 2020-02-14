<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="card">
      <!-- 添加用户区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="getparams.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table border style="width: 100%" class="tables" :data="userslist">
        <el-table-column type=index label="#" width="60">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="160">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="160">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="160">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="160">
          <!-- 选择按钮 -->
          <template slot-scope='aaa'>
            <el-switch v-model="aaa.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
              @change='mgState(aaa.row.id,$event)'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope='bb'>
            <!-- 操作按钮 -->
            <!-- {{bb.row.id}} -->
            <el-tooltip class="item" effect="dark" content="编辑按钮" placement="top-start" :enterable='false'>
              <el-button type="primary" icon="el-icon-edit" @click="alteruser(bb.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除按钮" placement="top-start" :enterable='false'>
              <el-button type="danger" icon="el-icon-delete" @click="delectuser(bb.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start" :enterable='false'>
              <el-button type="warning" icon="el-icon-s-tools"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航栏 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[1,2,3,4]"
        :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 弹出的添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%" @close='addClosed'>
      <el-form label-width="80px" :rules="addformRule" :model="addform" ref="addref">
        <el-form-item label="用户名" prop='username'>
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addqd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出的修改用户的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="xiugaiyonghu" @close='addAleruser' width="40%">
      <el-form label-width="80px" :model="alerlist" :rules="addformRule" ref="xiugairef">
        <el-form-item label="用户名" prop=''>
          <el-input v-model="alerlist.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="alerlist.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="alerlist.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xiugaiyonghu = false">取 消</el-button>
        <el-button type="primary" @click="altermege">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    //   验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        return cb()
      }
      return cb(new Error('请输入正确的邮箱'))
    }
    //     手机号的验证规则
    const checkPhone = (rule, value, cb) => {
      const regPhone = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regPhone.test(value)) {
        return cb()
      }
      return cb(new Error('请输入正确的手机号'))
    }
    return {
      userslist: [],
      getparams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      pagenum: 0,
      input: '',
      // 添加用户的显示与隐藏
      dialogVisible: false,
      // 修改用户的显示与隐藏
      xiugaiyonghu: false,
      // 添加用户的表单数据
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户的表单数据
      alerlist: {
        username: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单数据的验证规则
      addformRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }

        ]
      }

    }
  },
  methods: {
    //   获取用户列表
    async getuserlist () {
      const { data: res } = await this.axios.get('users', {
        params: this.getparams
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userslist = res.data.users
      this.total = res.data.total
      this.pagenum = res.pagenum
    },
    //     切换每页显示用户数量
    handleSizeChange (newsize) {
      this.getparams.pagesize = newsize
      this.getuserlist()
    },
    //     切换当前页
    handleCurrentChange (newchange) {
      this.getparams.pagenum = newchange
      this.getuserlist()
    },
    //     改变用户状态
    async mgState (id, el) {
      // console.log(id, el)
      const res = await this.axios.put(`users/${id}/state/${el}`)
      if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
      this.$message.success(res.data.meta.msg)
    },
    //     监听新建用户弹出框关闭时的事件
    addClosed () {
      // console.log(this.$refs)
      this.$refs.addref.resetFields()
    },
    //     点击确定按钮后触发
    addqd () {
      this.$refs.addref.validate(async value => {
        if (!value) return true
        //   进行添加用户
        const res = await this.axios.post('users', this.addform)
        if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getuserlist()
      })
    },
    //     修改用户方法
    async alteruser (id) {
      this.xiugaiyonghu = true
      const { data: res } = await this.axios.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.alerlist = res.data
    },
    //     监听修改用户弹出框关闭时的事件
    addAleruser () {
      this.$refs.xiugairef.resetFields()
    },
    //     修改用户信息按钮
    altermege () {
      this.$refs.xiugairef.validate(async value => {
        if (!value) return this.$message.error('请填写正确的格式')
        const { data: res } = await this.axios.put('users/' + this.alerlist.id, {
          email: this.alerlist.email,
          mobile: this.alerlist.mobile
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.xiugaiyonghu = false
        this.getuserlist()
        this.$message.success('改成用户信息成功')
      })
    },
    //     删除用户操作
    async delectuser (id) {
      const { data: res } = await this.axios.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getuserlist()
      this.$message.success('删除成功！！')
    }
  },
  created () {
    this.getuserlist()
  }
}
</script>
<style lang="less" scoped>
.card {
  margin-top: 20px;
}
.seach {
  width: 300px;
}
.tables {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
