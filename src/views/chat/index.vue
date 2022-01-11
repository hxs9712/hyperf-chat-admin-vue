<template>
  <div>
    <div class="dashboard-container">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="userlist" style="width: 100px;text-align: left;">
            <div v-for="user in userlist" :key="user.service_id">
              <el-badge :value="user.unread_count" class="item" style="margin-top: 20px;">
                <el-button size="small" @click="selectUser(user.cid,user.service_id)">{{ user.user_name }}</el-button>
              </el-badge>
            </div>
          </div>
          <div class="userlist" style="width: 100px;text-align: left;">
            <div v-for="chat_room in chatRoomList" :key="chat_room.crid">
              <el-badge :value="chat_room.unread_count" class="item" style="margin-top: 20px;">
                <el-button size="small" @click="selectChatRoom(chat_room.crid)">{{ chat_room.cr_name }}</el-button>
              </el-badge>
            </div>
          </div>
          <el-button type="success" size="small" style="margin-top: 20px" @click="dialogSelectVisible = true">建立聊天室
          </el-button>
        </el-col>
        <el-col :span="21">
          <el-card id="chatdiv" class="box-card" style="height: 500px;overflow-y: auto">
            <div slot="header" class="clearfix">
              <span>{{ chatObjectName }}</span>
              <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div class="text item">
              <el-row v-for="data in chatrecord" :key="data.id" :gutter="20" style="margin-top: 15px">
                <el-col v-if="data.from_service_id!=service_id" :span="12">
                  <el-tag>{{ data.from_username }}</el-tag>
                  <div class="chat-msg">
                    <span>   {{ data.content }}</span>
                    <div class="arrow-left" />
                  </div>
                </el-col>
                <el-col :span="12">&nbsp;</el-col>
                <el-col v-if="data.from_service_id==service_id" :span="12" style="text-align: right">
                  <div class="chat-msg">
                    <span>   {{ data.content }}</span>
                    <div class="arrow-right" />
                  </div>
                  <el-tag type="danger"> {{ data.from_username }}</el-tag>
                </el-col>
              </el-row>
            </div>

          </el-card>
          <div style="margin-top: 20px">
            <el-row :gutter="20">
              <el-col :span="22">
                <el-input v-model="input" placeholder="请输入内容" @keyup.enter.native="send" />
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="send">发送</el-button>
              </el-col>
            </el-row>

          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="选择群成员" :visible.sync="dialogSelectVisible">
      <el-input v-model="cr_name" />
      <el-checkbox-group v-model="checkList">
        <div v-for="user in userlist" :key="user.service_id">
          <el-checkbox :key="user.service_id" :label="user.service_id">{{ user.user_name }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelectVisible = false">取 消</el-button>
        <el-button type="primary" @click="buildChatRoom()">建立聊天室</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/request'

export default {
  name: 'Chat',
  data() {
    return {
      input: '',
      ws: '',
      userlist: [],
      chatrecord: [],
      to_service_id: '',
      crid: '',
      service_id: localStorage.getItem('service_id'),
      cid: '', // 会话id
      dialogSelectVisible: false,
      cr_name: '', // 聊天室名称
      checkList: [], // 群成员
      chatRoomList: [], // 聊天室
      chatType: 1, // 1个人聊天2群聊
      chatObjectName: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.cid = this.$route.query.cid
    this.to_service_id = this.$route.query.to_service_id
    this.crid = this.$route.query.crid
    this.getUser()
    this.open()
    this.getChatRoom()
    if (this.cid && this.to_service_id) {
      this.selectUser(this.cid, this.to_service_id)
    }
    if (this.crid) {
      this.selectChatRoom(this.crid)
    }
  },
  methods: {
    open() {
      this.ws = new WebSocket('ws://10.0.4.145:9502?token=' + localStorage.getItem('token'))
      var _this = this
      // setTimeout(function() {
      //   _this.ws.send(JSON.stringify([{ type: 1, 'token': localStorage.getItem('token') }]))
      // }, 500)

      this.ws.onmessage = function(e) {
        console.log(e)
        var message_info = JSON.parse(e.data)
        if (message_info.type === 1) {
          _this.$message.error('请登录')
        } else if (message_info.type === 2) {
          _this.$message.error('token无效')
        }
        _this.chatrecord.push(message_info)
        _this.getUser()
        // _this.selectUser(_this.to_service_id)
        _this.scroll()
        if (!message_info.crid && _this.to_service_id === message_info.from_service_id) {
          request.post('/admin/chat/reduceUnread', { 'chatType': _this.chatType, 'crid': _this.crid, 'cid': _this.cid })
          return false
        }
        if (message_info.crid && _this.crid === message_info.crid) {
          request.post('/admin/chat/reduceUnread', { 'chatType': _this.chatType, 'crid': _this.crid, 'cid': _this.cid })
          return false
        }
      }
    },
    send() {
      if ((!this.to_service_id || this.to_service_id == 'undefined') && !this.crid) {
        this.$message.error('请选择发送对象')
        return false
      }
      if (!this.input) {
        this.$message.error('发送消息不能为空')
        return false
      }
      this.ws.send(JSON.stringify([{
        'type': 2,
        'content': this.input,
        'token': localStorage.getItem('token'),
        'to_service_id': this.to_service_id,
        'from_service_id': this.service_id,
        'cid': this.cid,
        'chatType': this.chatType,
        'crid': this.crid
      }]))
      this.chatrecord.push({
        'from_username': localStorage.getItem('username'),
        'content': this.input,
        'from_service_id': this.service_id
      })
      this.input = ''
      this.scroll()
    },
    getUser() {
      var _this = this
      request.get('/admin/chat/userlist').then((res) => {
        _this.userlist = res.data.user
      })
    },
    selectUser(cid, to_service_id) {
      var _this = this
      request.post('/admin/chat/record', {
        cid: cid,
        to_service_id: to_service_id
      }).then((res) => {
        _this.chatrecord = res.data.chat_record
        console.log(res.data)
        _this.cid = cid
        _this.to_service_id = to_service_id
        _this.chatObjectName = res.data.service.user_name
        _this.scroll()
        const newUrl = this.$route.path + `?cid=${cid}&to_service_id=${this.to_service_id}`
        window.history.replaceState('', '', newUrl)
        _this.chatType = 1
      })
    },
    scroll() {
      this.$nextTick(function() {
        var div = document.getElementById('chatdiv')
        console.log(div.scrollHeight)
        div.scrollTop = div.scrollHeight
      })
    },
    buildChatRoom() {
      var _this = this
      var member_id_arr = { ..._this.checkList }
      console.log(member_id_arr)
      request.post('/admin/chat/buildChatRoom', {
        cr_name: _this.cr_name,
        member_id_arr: member_id_arr
      }).then((res) => {
        if (res.code === 200) {
          _this.$message.success(res.msg)
          _this.dialogSelectVisible = false
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    getChatRoom() {
      var _this = this
      request.post('/admin/chat/getChatRoom').then((res) => {
        _this.chatRoomList = res.data.chat_room
      })
    },
    selectChatRoom(crid) {
      var _this = this
      request.post('/admin/chat/getChatRoomRecord', {
        crid: crid
      }).then((res) => {
        _this.chatrecord = res.data.chat_record
        _this.chatObjectName = res.data.chat_room.cr_name
        _this.scroll()
        const newUrl = this.$route.path + `?crid=${crid}`
        window.history.replaceState('', '', newUrl)
        _this.chatType = 2
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.chat-msg {
  position: relative;
  height: 30px;
  background-color: yellowgreen;
  line-height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-block; //行内块元素,宽度自适应
  margin-right: 10px;
  margin-left: 10px;
}

.arrow-right {
  position: absolute;
  top: 5px;
  right: -18px;
  width: 0;
  height: 0;
  border: 10px solid;
  border-color: transparent;
  border-left-color: yellowgreen !important;
  display: inline-block;
}

.arrow-left {
  position: absolute;
  top: 5px;
  left: -18px;
  width: 0;
  height: 0;
  border: 10px solid;
  border-color: transparent;
  border-right-color: yellowgreen !important;
  display: inline-block;
}
</style>
