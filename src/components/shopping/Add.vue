<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部提示 -->
      <el-alert title="添加商品信息" :closable='false' type="info" center show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active -0" finish-status="success" space='600px' align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单 -->
      <el-form :model="addFrom" :rules="addRules" label-position='top' ref="ruleForm" label-width="100px"
        class="demo-ruleForm">
        <!-- tabs栏 -->
        <el-tabs tab-position="left" v-model="active" :before-leave="addBeforeleave" @tab-click="addhandleClick">
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type='number'></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type='number'></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type='number'></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 连级选择器 -->
              <el-cascader clearable v-model="props.addCascaderitem" :options="addShopLists" :props="props"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数 -->
            <el-form-item v-for="item in shopParalist" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item2,index2) in item.attr_vals" :key="index2" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 商品属性 -->
            <el-form-item v-for="item in jtShopLits" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <el-upload :headers='headers' action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :on-success='upSuccess'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本区域 -->
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
            <el-button type="primary" class="aa" @click="add">添加商品</el-button>
          </el-tab-pane>

        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      //     步骤的index
      active: '0',
      // 添加表单绑定的数据对象
      addFrom: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '',
        pics: [],
        goods_introduce: ''
      },

      // 获得的商品分类列表数据
      addShopLists: [],
      // 连级选择器的数据指定
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        // 连级选择器选择的数据
        addCascaderitem: []
      },
      // 图片上传组件的请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 动态商品参数列表
      shopParalist: [],
      // 静态商品列表
      jtShopLits: [],
      // 表单的验证规则
      addRules: {
        // 商品名称
        goods_name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        //   商品价格
        goods_price: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        //   商品重量
        goods_weight: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        //   商品数量
        goods_number: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    //   获取商品分类列表
    async  addGetShopLists () {
      const { data: res } = await this.axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.addShopLists = res.data
    },
    //     连级选择器结束事件
    handleChange () {
      if (this.props.addCascaderitem.length !== 3) {
        this.props.addCascaderitem = []
        this.$message.error('请输入三级标签')
      }
    },
    //     tabs栏点击判断事件
    addBeforeleave (active, old) {
      if (old === '0') {
        if (this.props.addCascaderitem.length !== 3) {
          this.$message.error('请选择商品分类！')
          return false
        }
      }
    },
    //     tabs栏点击切换
    async  addhandleClick () {
      if (this.active === '1') {
        const { data: res } = await this.axios.get(`categories/${this.props.addCascaderitem[this.props.addCascaderitem.length - 1]}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        this.shopParalist = res.data
      } else if (this.active === '2') {
        const { data: res } = await this.axios.get(`categories/${this.props.addCascaderitem[this.props.addCascaderitem.length - 1]}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.jtShopLits = res.data
      }
    },
    //     点击预览图片的事件
    handlePreview () { },
    //     点击清除图片的事件
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addFrom.pics.findIndex(item => {
        return item.pic === filePath
      })
      this.addFrom.pics.splice(index, 1)
    },
    //     图片上传成功之后的事件
    upSuccess (res) {
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      const pic = { pic: res.data.tmp_path }
      this.addFrom.pics.push(pic)
    },
    //     添加商品
    add () {
      this.$refs.ruleForm.validate(async value => {
        if (!value) {
          this.$message.error('请完整的填写表单')
        } else {
          this.addFrom.goods_cat = this.props.addCascaderitem.join(',')
          const arr = this.shopParalist.concat(this.jtShopLits)
          this.addFrom.atts = arr
          const { data: res } = await this.axios.post('goods', this.addFrom)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.$router.push('/goods')
        }
      })
    }
  },
  created () {
    this.addGetShopLists()
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
.el-tag {
  margin: 0 20px;
}
.aa {
  margin-top: 20px;
}
</style>
