<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="crad-box">
      <!-- 添加按钮 -->
      <el-button type="primary" class="button" @click="dialogVisible=true">添加角色</el-button>
      <!-- 列表区域 -->
      <el-table :data="roles" border stripe>
        <!-- 展开页面 -->
        <el-table-column width="50" type="expand">
          <template slot-scope="bb">
            <el-row v-for="(item1,index1) in bb.row.children" :key="item1.id"
              :class="['evenybomon','duiqi',index1===0?'top':'']">
              <!-- 一级 -->
              <el-col :span="6">
                <el-tag closable @close='closetag(bb.row.id,item1.id)'>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级 -->
              <el-col :span="18">
                <el-row :gutter="20" v-for="(item2,index2) in item1.children" :key="item2.id"
                  :class="['duiqi',index2===0?'':'top']">
                  <el-col :span="8">
                    <el-tag closable @close='closetag(bb.row.id,item2.id)' type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag closable type="warning" v-for="item3 in item2.children"
                      @close='closetag(bb.row.id,item3.id)' :key="item3.id">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-table-column></el-table-column>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop=' roleName'>
        </el-table-column>
        <el-table-column label="角色描述" prop='roleDesc'></el-table-column>
        <el-table-column label="操作" width="500">
          <template slot-scope="cc">
            <el-button type="primary" icon="el-icon-edit" @click="editrole(cc.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delectRole(cc.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools" @click="authorityDistribution(cc.row)">分配权限</el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <!-- 输入表单 -->
      <el-form label-width="80px" :model="roleslist" :rules="addroleVeritfy" @close='closerole' ref="yonghuref">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleslist.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleslist.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrolelist">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="提示" :visible.sync="bianjiVisible" width="30%">
      <!-- 输入表单 -->
      <el-form label-width="80px" :model="bianji" :rules="addroleVeritfy" @close='closerole'>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="bianji.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="bianji.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bianjiVisible = false">取 消</el-button>
        <el-button type="primary" @click="bianjierole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限列表" :visible.sync="allotJurisdictionCase" width="30%">
      <!-- 树状控件 -->
      <el-tree ref="treeRef" :data="authoritytree" :props="defaultProps" show-checkbox :default-checked-keys="defkeys"
        node-key="id" default-expand-all>
      </el-tree>
      <!-- <template slot-scope="dd"> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotJurisdictionCase = false">取 消</el-button>
        <el-button type="primary" @click="postCole">确 定</el-button>
      </span>
      <!-- </template> -->
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      //     角色列表数据
      roles: [],
      // 权限列表树状数据
      authoritytree: [],
      // 添加用户对话框隐藏与显示
      dialogVisible: false,
      // 编辑用户对话隐藏与显示
      bianjiVisible: false,
      // 分配权限对话框隐藏与显示
      allotJurisdictionCase: false,
      // 添加角色数据
      roleslist: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑用户对话框数据
      bianji: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色对话框的验证消息
      addroleVeritfy: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 树状控件的内容指定
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中
      defkeys: [],
      nodeId: 0
    }
  },
  methods: {
    //   获取角色列表数据
    async  getRolelist () {
      const { data: res } = await this.axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roles = res.data
    },
    //     监听添加用户对话框事件
    closerole () {
      //     清除所有提示
      this.$refs.yonghuref.resetFields()
    },
    //     添加用户对话框事件
    addrolelist () {
      this.$refs.yonghuref.validate(async value => {
        if (!value) return this.$message.error('请输入格式正确的信息')
        const { data: res } = await this.axios.post('roles', this.roleslist)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.dialogVisible = false
        this.getRolelist()
      })
    },
    //     获取编辑用户数据
    async  editrole (id) {
      this.bianjiVisible = true
      const { data: res } = await this.axios.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.bianji = res.data
    },
    //     编辑用户对话框确定按钮
    async bianjierole () {
      const { data: res } = await this.axios.put('roles/' + this.bianji.roleId, this.bianji)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.bianjiVisible = false
      this.getRolelist()
    },
    //     删除角色
    async  delectRole (id) {
      const { data: res } = await this.axios.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolelist()
    },
    //     删除角色指定权限
    async closetag (roleId, rightId) {
      const { data: res } = await this.axios.delete(`roles/${roleId}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolelist()
    },
    //     获取权限树状列表
    async authorityDistribution (node) {
      const { data: res } = await this.axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.authoritytree = res.data
      this.nodeId = node.id
      this.defkeys = []
      this.getAllThreeId(node, this.defkeys)
      this.allotJurisdictionCase = true
    },
    //     通过递归获取所有三级权限的id
    getAllThreeId (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(value => {
        this.getAllThreeId(value, arr)
      })
    },
    async postCole () {
      const arrs = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const obj = arrs.join(',')
      const { data: res } = await this.axios.post(`roles/${this.nodeId}/rights`, {
        rids: obj
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.allotJurisdictionCase = false
      this.getRolelist()
    }
  },
  created () {
    this.getRolelist()
  }
}
</script>
<style lang="less" scoped>
.crad-box {
  margin-top: 20px;
}
.button {
  margin-bottom: 20px;
}
.el-col {
  margin: 10px 0;
}
.el-tag {
  margin-right: 15px;
}
.evenybomon {
  border-bottom: 1px solid #ccc;
}
.top {
  border-top: 1px solid #ccc;
}
.duiqi {
  display: flex;
  align-items: center;
}
</style>
