<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="crad-box">
      <!-- 添加按钮 -->
      <el-button type="primary" class="button" @click="getFatherClassList">添加分类</el-button>
      <!-- 列表区域 -->
      <tree-table :data='goodsCategoryList' :selection-type='false' :show-index='true' border index-text='#'
        :expand-type='false' :columns="columns">
        <template slot="isok" slot-scope="aa">
          {{aa.a}}
          <i :class="aa.row.cat_deleted?'el-icon-error':'el-icon-success'"></i>
        </template>
        <template slot="rank" slot-scope="bb">
          <el-tag v-if='bb.row.cat_level===0'>一级</el-tag>
          <el-tag v-else-if="bb.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="operation" slot-scope="cc">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteClassList(cc.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页导航栏 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[2,3,4,5,6,7,8]"
        :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="40%" @close='closeClassify'>
      <el-form :model="classificationList" :rules="addClassification" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="classificationList.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader :change-on-select="true" expand-trigger="hover" size='small' v-model="fatherKey"
            :options="fatherClassList" :props="propss" @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      //     商品分类列表数据
      goodsCategoryList: [],
      // 获取商品分类列表传递参数
      getCategories: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 添加分类数据内容
      classificationList: {
        // 添加分类的名字
        cat_name: '',
        //   分类付ID
        cat_pid: 0,
        //   分类的等级
        cat_level: 0
      },
      // 添加分类对话框显示与隐藏
      dialogVisible: false,
      // 总数据量
      total: 0,
      // 父级分类列表数据
      fatherClassList: [],
      columns: [

        {
          label: '分类名称',
          prop: 'cat_name',
          width: '250px'
        },
        //   是否有效列表
        {
          label: '是否有效',
          minWidth: '50px',
          type: 'template',
          template: 'isok'
        },
        //   排序列表
        {
          label: '排序',
          type: 'template',
          template: 'rank'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      // 添加分类的验证
      addClassification: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类选则后的数据id们
      fatherKey: [],
      // 配置对象的具体内容
      propss: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    //    获取商品分类列表数据
    async  getgoodsCategoryList () {
      const { data: res } = await this.axios.get('categories', {
        params: this.getCategories
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsCategoryList = res.data.result
      this.total = res.data.total
    },
    //     获取父级分类的所有列表
    async getFatherClassList () {
      const { data: res } = await this.axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.fatherClassList = res.data
      this.dialogVisible = true
    },
    //     分页导航栏页码大小事件
    handleSizeChange (value) {
      this.getCategories.pagesize = value
      this.getgoodsCategoryList()
    },
    //     分页导航栏页码变动事件
    handleCurrentChange (value) {
      this.getCategories.pagenum = value
      this.getgoodsCategoryList()
    },
    //     当父级分类级联选则器选完之后发生的事件
    handleChange () {
      // 判断fatherClassList数组的长度大于0，说明有选则父类，如果长度等于0
      // 所以要更改将要提交classificationList数组的父id与分类层次
      // 说明没有选则父类，则说明他是一级的要把fuid和分类层次重置为0
      if (this.fatherKey.length > 0) {
        this.classificationList.cat_pid = this.fatherKey[this.fatherKey.length - 1]
        this.classificationList.cat_level = this.fatherKey.length
      } else {
        this.classificationList.cat_pid = 0
        this.classificationList.cat_level = 0
      }
    },
    //     点击添加分类对话框确定按钮
    addCate () {
      this.$refs.addCateFormRef.validate(async value => {
        if (!value) return this.$message.error('请填写正确的格式')
        const { data: res } = await this.axios.post('categories', this.classificationList)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getgoodsCategoryList()
      })
    },
    //     添加分类对话框关闭事件
    closeClassify () {
      this.$refs.addCateFormRef.resetFields()
    },
    //     删除分类
    async  deleteClassList (id) {
      const { data: res } = await this.axios.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getgoodsCategoryList()
    }
  },
  created () {
    this.getgoodsCategoryList()
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.button {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
