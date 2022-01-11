<template>
  <div class="userlist-container">
    <div class="app-container">
      <div class="filter-container">
        <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        <!--        添加用户弹框-->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-input v-model="form.service_id" type="hidden" />
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.user_name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="昵称" :label-width="formLabelWidth">
              <el-input v-model="form.nick_name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth">
              <el-input v-model="form.mobile" autocomplete="off" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input v-model="form.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="form.password" autocomplete="off" show-password />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserAjax()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-table
        :data="tableData"
        border
      >
        <el-table-column
          fixed
          prop="service_id"
          label="客服编号"
          width="150"
        />
        <el-table-column
          prop="user_name"
          label="姓名"
          width="120"
        />
        <el-table-column
          prop="nick_name"
          label="昵称"
          width="120"
        />
        <el-table-column
          prop="phone"
          label="手机号"
          width="120"
        />
        <el-table-column
          prop="email"
          label="邮箱"
          width="300"
        />
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.service_id!=service_id" type="text" size="small" @click="buildChat(scope.row)">发起聊天</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'

export default {
  name: 'Userlist',
  data() {
    return {
      tableData: [],
      form: {
        service_id: '',
        user_name: '',
        nick_name: '',
        password: '',
        phone: '',
        email: ''
      },
      formLabelWidth: '120',
      dialogFormVisible: false,
      service_id: ''
    }
  },
  computed: {
    // 获取了用户的权限信息
    ...mapGetters(['name'])
  },
  created() {
    this.getUser()
    this.service_id = localStorage.getItem('service_id')
  },
  methods: {
    getUser() {
      var _this = this
      request.get('/admin/user/list').then((res) => {
        _this.tableData = res.data.user
      })
    },
    editUserAjax() {
      var _this = this
      request.post('/admin/user/edit', _this.form).then((res) => {
        console.log(res)
        if (res.code === 200) {
          _this.$message.success(res.msg)
          _this.dialogFormVisible = false
          _this.getUser()
        } else {
          _this.$message.error(res.msg)
        }
      }).catch(error => {
        console.log(error)
        _this.$message.error(error.response.data.content)
      })
    },
    editUser(row) {
      this.form = row
      this.dialogFormVisible = true
    },
    buildChat(row) {
      var _this = this
      request.post('/admin/user/buildChat', {
        from_service_id: localStorage.getItem('service_id'),
        to_service_id: row.service_id
      }).then((res) => {
        _this.$router.push({ path: '/chat/chat?cid=' + res.data.cid + '&to_service_id=' + row.service_id })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
