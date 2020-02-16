<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon>
      </el-alert>
      <p>选择商品分类：
        <!-- options用来指定数据源 -->
        <!-- props用来指定配置对象 -->
        <el-cascader clearable v-model="fatherKey" :options="shoppingList" :props="propss" @change="handleChange">
        </el-cascader>
      </p>
      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="only">
          <!-- 添加参数按钮 -->
          <el-button type="primary" :disabled="buttonShow" @click="addParameter">添加参数</el-button>
          <!-- 动态参数表格区域 -->
          <el-table :data="tabList" height="250" border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="aa">
                <el-tag @close="handleClose(index,aa.row)" class="tag_a" closable
                  v-for="(item, index) in aa.row.attr_vals" :key="index">{{item}}</el-tag>
                <!-- 动态编辑标签 -->
                <el-input class="input-new-tag" :autofocus='false' v-if="aa.row.inputVisible"
                  v-model="aa.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(aa.row)" @blur="handleInputConfirm(aa.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(aa.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="bb">
                <el-button type="primary" icon="el-icon-edit" @click="alterName(bb.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParameter(bb.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="many">
          <!-- 添加静态属性按钮 -->
          <el-button type="primary" :disabled="buttonShow" @click="addParameter">添加属性</el-button>
          <!-- 静态属性表格区域 -->
          <el-table :data="tabList" height="250" border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="cc">
                <!-- 动态编辑标签 -->
                <el-tag @close="handleClose(index,cc.row)" class="tag_a" closable
                  v-for="(item, index) in cc.row.attr_vals" :key="index">{{item}}</el-tag>
                <el-input class="input-new-tag" :autofocus='false' v-if="cc.row.inputVisible"
                  v-model="cc.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(cc.row)" @blur="handleInputConfirm(cc.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(cc.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="dd">
                <el-button type="primary" icon="el-icon-edit" @click="alterName(dd.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParameter(dd.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog :title="'添加' +titleName" :visible.sync="dialogVisible" width="40%" @close="dialogClose">
      <!-- 输入表单 -->
      <el-form ref="parameterform" :model="parametermag" label-width="80px" :rules='ruless'>
        <el-form-item :label="titleName" prop="attr_name">
          <el-input v-model="parametermag.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParameterlist">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加对话框 -->
    <el-dialog :title="'修改'+titleName" :visible.sync="alterVisible" width="40%" @close="dialogCloses">
      <!-- 输入表单 -->
      <el-form ref="alterfrom" :model="alterData" label-width="80px" :rules='ruless'>
        <el-form-item :label="titleName" prop="attr_name">
          <el-input v-model="alterData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterYes">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog title="删除" :visible.sync="deleteVisible" width="40%">
      <span>您确定要删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteYes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      //     商品分类数据
      shoppingList: [],
      // 商品分类选择框的数据
      fatherKey: {},
      // 配置对象的具体内容
      propss: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // tab页签绑定数据
      activeName: '',
      // tab获取的参数列表
      tabList: [],
      // 添加参数对话框的显示与隐藏
      dialogVisible: false,
      // 修改对话框的显示与隐藏
      alterVisible: false,
      // 参数输入表单内容
      parametermag: {
        attr_name: ''
      },
      // 参数输入表单验证
      ruless: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
        ]
      },
      // 修改数据的数据绑定
      alterData: {
        attr_name: ''
      },
      // 修改的id
      alterID: '',
      // 删除对话框的显示与隐藏
      deleteVisible: false
    }
  },
  methods: {
    //   获取商品分类数据
    async getShoppingList () {
      const { data: res } = await this.axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.shoppingList = res.data
    },
    //     选择商品分类触发事件
    handleChange () {
      //     对fatherKey进行监听，必须为三级目录否则清空
      if (this.fatherKey.length !== 3) {
        this.fatherKey = []
        this.$message.error('请选择三级分类')
        this.tabList = []
        return
      }
      this.activeName = 'only'
      this.handleClick()
    },
    //     tab页签点击事件
    async  handleClick () {
      if (this.fatherKey.length) {
        const { data: res } = await this.axios.get(`categories/${this.fatherKey[this.fatherKey.length - 1]}/attributes`, {
          params: {
            sel: this.activeName
          }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        this.tabList = res.data
      } else {
        this.$message.error('请选择商品分类')
      }
    },
    //     添加参数按钮事件
    addParameter () {
      this.dialogVisible = true
    },
    //     添加参数确定按钮事件
    addParameterlist () {
      this.$refs.parameterform.validate(async value => {
        if (!value) return this.$message.error('请输入内容！')
        const { data: res } = await this.axios.post(`categories/${this.fatherKey[this.fatherKey.length - 1]}/attributes`, {
          attr_name: this.parametermag.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.handleClick()
        this.dialogVisible = false
      })
    },
    //     对话框关闭事件
    dialogClose () {
      this.$refs.parameterform.resetFields()
    },
    //     对话框关闭事件
    dialogCloses () {
      this.$refs.alterfrom.resetFields()
    },
    //     修改数据
    async alterName (catId) {
      this.alterID = catId
      const { data: res } = await this.axios.get(`categories/${this.fatherKey[this.fatherKey.length - 1]}/attributes/${catId}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.alterData = res.data
      this.alterVisible = true
    },
    //     修改表单确定按钮
    alterYes () {
      this.$refs.alterfrom.validate(async value => {
        if (!value) return this.$message.error('请输入内容')
        const { data: res } = await this.axios.put(`categories/${this.fatherKey[this.fatherKey.length - 1]}/attributes/${this.alterID}`, {
          attr_name: this.alterData.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.alterVisible = false
        this.handleClick()
      })
    },
    //     删除按钮事件
    deleteParameter (catId) {
      this.alterID = catId
      this.deleteVisible = true
    },
    //     删除对话框确定事件
    async deleteYes () {
      const { data: res } = await this.axios.delete(`categories/${this.fatherKey[this.fatherKey.length - 1]}/attributes/${this.alterID}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.deleteVisible = false
      this.handleClick()
    },
    //     将对attr_vals的操作合并为一个方法
    async attrVals (row) {
      //     如果没有输入内容
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      // 输入内容了
      row.attr_vals.push(row.inputValue.trim())
      const { data: res } = await this.axios.put(`categories/${this.fatherKey[this.fatherKey.length - 1]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      row.inputValue = ''
      row.inputVisible = false
    },
    //     当键盘回车按下或者鼠标失去焦点的时候触发的事件
    handleInputConfirm (row) {
      this.attrVals(row)
    },
    //     动态编辑标签按钮按下的事件
    showInput (row) {
      row.inputVisible = true
      // this.$nextTick的意思是在页面重新渲染完之后才会调用里面的回调函数，
      // 因为如果直接调用里面的函数如果页面没渲染完调用focus方法就会报错
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //     删除标签事件
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.attrVals(row)
    }
  },
  created () {
    this.getShoppingList()
  },
  computed: {
    buttonShow () {
      if (this.fatherKey.length !== 3) {
        return true
      }
      return false
    },
    //     动态计算标题的文本
    titleName () {
      if (this.activeName === 'only') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-cascader {
  margin: 20px 0;
}
.el-table {
  margin-top: 20px;
}
.input-new-tag {
  width: 86px;
}
.tag_a {
  margin: 0 10px;
}
</style>
