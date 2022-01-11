<template>
  <div class="userlist-container">
    <div class="app-container">
      <!-- 条件搜索部分 -->
      <div class="filter-container">
        <el-select v-model="listQuery.stationId" filterable class="filter-item" placeholder="所属站点">
          <el-option
            v-for="item in comparisonList"
            :key="item.id"
            :label="item.stationName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <el-button
          v-waves
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >添加</el-button>
      </div>

      <!-- 表格显示部分 -->
      <el-table
        :data="VIPHallList"
        style="width: 100%"
        :default-sort="{prop: 'hallId'}"
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="hallId" label="贵宾厅序号" sortable="custom" width="120"></el-table-column>
        <el-table-column prop="hallType" label="贵宾厅类型" width="120"></el-table-column>
        <el-table-column prop="hallName" label="贵宾厅名称" width="180"></el-table-column>
        <el-table-column prop="businessHours" label="营业时间" width="100"></el-table-column>
        <el-table-column prop="servicePhone" label="服务电话" width="120"></el-table-column>
        <el-table-column prop="hallLocation" label="所在位置" width="180"></el-table-column>
        <el-table-column prop="hallStatus" label="营业状态" width="80"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button v-waves type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button v-waves type="danger" size="mini" @click="handleDelete(row)">刪除</el-button>
            <el-button v-waves type="info" size="mini" @click="handleInfo(row)">更多</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增和修改数据弹出框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="120px"
          style="width: 400px; margin-left:60px;"
        >
          <el-form-item label="1 所属车站" prop="stationId">
            <el-select v-model="temp.stationId" filterable class="filter-item" placeholder="所属站点">
              <el-option
                v-for="item in comparisonList"
                :key="item.id"
                :label="item.stationName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="2 贵宾厅类型" prop="hallType">
            <el-select
              v-model="temp.hallType"
              filterable
              class="filter-item"
              placeholder="请选择贵宾厅类型"
            >
              <el-option
                v-for="item in hallTypeOption"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="3 贵宾厅的名称" prop="hallName">
            <el-input v-model="temp.hallName" />
          </el-form-item>
          <el-form-item label="4 营业时间" prop="businessHours">
            <template>
              <el-time-select
                placeholder="起始时间"
                v-model="startTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:30',
                  end: '22:30'
                }"
              ></el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="endTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:30',
                  end: '22:30',
                  minTime: startTime
                }"
              ></el-time-select>
            </template>
          </el-form-item>
          <el-form-item label="5 服务电话" prop="servicePhone">
            <el-input v-model="temp.servicePhone" />
          </el-form-item>
          <el-form-item label="6 贵宾厅的位置" prop="hallLocation">
            <el-input v-model="temp.hallLocation" />
          </el-form-item>
          <el-form-item label="7 五星要客类型" prop="hallVisitors">
            <el-select
              v-model="temp.hallVisitors"
              filterable
              class="filter-item"
              placeholder="请选择五星要客类型"
            >
              <el-option
                v-for="item in hallVisitorsOption"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="8 快捷通道类型" prop="shortcutType">
            <el-input v-model="temp.shortcutType" />
          </el-form-item>
          <el-form-item label="9 贵宾服务ID" prop="serviceId">
            <!-- <el-input v-model="temp.serviceId" /> -->
            <el-checkbox-group v-model="serviceLabel">
              <el-checkbox
                v-for="item in serviceOption"
                :label="item.serviceId"
                :key="item.serviceId"
              >{{item.serviceName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="10 贵宾厅图片" prop="hallPic">
            <el-input v-model="temp.hallPic" />
            <!-- <el-upload
              action="http://192.168.0.163:8086/yuyuetrip/station/ossUpload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>-->
            <!-- 自定义图片上传 -->
            <!-- <el-upload
              action="fakeaction"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :http-request="uploadImage"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>-->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>

      <!-- 贵宾厅详情dialog -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogInfoVisible" width="750px">
        <el-carousel height="300px">
          <el-carousel-item v-for="item in testCarousel" :key="item.id">
            <div class="carouselWrap">
              <img :src="item.imgSrc" />
              <img />
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="title">{{VIPHallList[index].hallName}}</div>
        <div class="time">
          <i class="el-icon-time" style="backgorund-color:orange" />
          <span>营业时间 ： {{VIPHallList[index].businessHours}}</span>
        </div>
        <div class="phone">
          <i class="el-icon-phone" style="backgorund-color:pink" />
          <span>服务电话 ： {{VIPHallList[index].servicePhone}}</span>
        </div>
        <div class="location">
          <i class="el-icon-location" style="backgorund-color:skyblue" />
          <span>站厅位置 ： {{VIPHallList[index].hallLocation}}</span>
        </div>
        <div class="servicesWrap">
          <div class="services" v-for="item in VIPHallList[index].services" :key="item.serviceId">
            <div class="imgWrap">
              <img :src="item.serviceIcon" :alt="item.serviceName" />
            </div>
            <span>{{item.serviceName}}</span>
          </div>
        </div>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="dialogInfoVisible = false">取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>-->
      </el-dialog>

      <!-- 测试区域开始 -->
      <!-- 测试区域结束 -->
    </div>
  </div>
</template>

<script>
// 引入请求数据api
import {
  getVIPHallByStationId,
  getComparisonList,
  createVIPHall,
  updateVIPHall,
  deleteVIPHall,
  getVIPHallById,
  ossUpload
} from '@/api/station'
// 引入水波纹效果指令
import waves from '@/directive/waves' // waves directive
// 引入分页组件
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 图片上传参数
      dialogImageUrl: '',
      dialogVisible: false,
      // 厅内服务在添加修改dialog处复选框选项绑定的数组,这个到后面应该是后台返回的数据
      serviceOption: [
        {
          serviceId: 1,
          serviceName: '服务项1'
        },
        {
          serviceId: 2,
          serviceName: '服务项2'
        },
        {
          serviceId: 3,
          serviceName: '服务项3'
        },
        {
          serviceId: 4,
          serviceName: '服务项4'
        },
        {
          serviceId: 5,
          serviceName: '服务项5'
        },
        {
          serviceId: 6,
          serviceName: '服务项6'
        },
        {
          serviceId: 7,
          serviceName: '服务项7'
        },
        {
          serviceId: 8,
          serviceName: '服务项8'
        },
        {
          serviceId: 9,
          serviceName: '服务项9'
        },
        {
          serviceId: 10,
          serviceName: '服务项10'
        }
      ],
      // 厅内服务在添加修改dialog处复选框内容绑定的数组
      serviceLabel: [1, 2, 3, 4],
      // 贵宾厅详情dialog轮播图地址数组
      testCarousel: [
        {
          id: 1,
          imgSrc:
            'https://yue-public-1256591252.cos.ap-beijing.myqcloud.com/res/platform/hall/pictures/c9c5b00e638a498cbd5f9473aa8030da.jpg'
        },
        {
          id: 2,
          imgSrc:
            'https://yue-public-1256591252.cos.ap-beijing.myqcloud.com/res/platform/hall/pictures/4043b81946d04165b7be9851c83f9131.jpg'
        },
        {
          id: 3,
          imgSrc:
            'https://yue-public-1256591252.cos.ap-beijing.myqcloud.com/res/platform/hall/pictures/6087bfe0593d4f6ca5abc3a3e011de22.jpg'
        }
      ],
      // 更多dialog显示数据对应大数组中的下标
      index: 0,
      // 贵宾厅详情dialog显示控制
      dialogInfoVisible: false,
      // dialog营业时间存储
      startTime: '',
      endTime: '',
      // dialog五星要客类型对应数组
      hallVisitorsOption: [
        {
          type: '0',
          label: '非五星要客'
        },
        {
          type: '1',
          label: '上车'
        },
        {
          type: '2',
          label: '下车'
        }
      ],
      // dialog贵宾厅类型对应数组
      hallTypeOption: [
        {
          type: '1',
          label: '自营'
        },
        {
          type: '2',
          label: '民营'
        }
      ],
      // 站点和ID对照表
      comparisonList: [],
      // 弹出框表单渲染数据
      temp: {
        // 1 所属车站的ID,返回的数据中有
        stationId: '',
        // 2 贵宾厅类型，返回的数据中有
        hallType: '',
        // 3 贵宾厅的名称，返回的数据中有
        hallName: '',
        // 4 营业时间，返回的数据中有
        businessHours: '',
        // 5 服务电话，返回的数据中有
        servicePhone: '',
        // 6 贵宾厅的位置，返回的数据中有
        hallLocation: '',
        // 7 五星要客类型，返回的数据中有
        hallVisitors: '',
        // 8 快捷通道类型，返回的数据中有
        shortcutType: '',
        // 9 贵宾服务ID，需要在services子目录中获取
        serviceId: [],
        // 10 贵宾厅图片，返回的数据中有
        hallPic: ''
      },
      // 弹出框表单验证规则
      rules: {
        // 1 所属车站的ID验证规则
        stationId: [
          { required: true, message: '所属车站未填写', trigger: 'blur' }
        ],
        // 2 贵宾厅类型验证规则
        hallType: [
          { required: true, message: '贵宾厅类型未填写', trigger: 'blur' }
        ],
        // 3 贵宾厅的名称验证规则
        hallName: [
          { required: true, message: '贵宾厅的名称未填写', trigger: 'blur' }
        ],
        // 4 营业时间验证规则
        /* businessHours: [
          { required: true, message: '营业时间未填写', trigger: 'blur' }
        ], */
        // 5 服务电话验证规则
        servicePhone: [
          { required: true, message: '服务电话未填写', trigger: 'blur' }
          /* {
            required: true,
            pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})|((166|199|198)[0-9]{1}\d{7})$/,
            message: '请输入正确的电话号码',
            trigger: 'blur'
          } */
        ],
        // 6 贵宾厅的位置验证规则
        hallLocation: [
          { required: true, message: '贵宾厅的位置未填写', trigger: 'blur' }
        ],
        // 7 五星要客类型验证规则
        hallVisitors: [
          { required: true, message: '五星要客类型未填写', trigger: 'blur' }
        ],
        // 8 快捷通道类型验证规则
        shortcutType: [
          { required: true, message: '快捷通道类型未填写', trigger: 'blur' }
        ],
        // 9 贵宾服务ID验证规则
        serviceId: [
          // { required: true, message: '贵宾厅图片未填写', trigger: 'blur' }
        ],
        // 10 贵宾厅图片验证规则
        hallPic: [
          // { required: true, message: '贵宾厅图片未填写', trigger: 'blur' }
        ]
      },
      //弹出框显示或不显示状态
      dialogFormVisible: false,
      // 弹出框显示新增还是编辑
      dialogStatus: '',
      // 弹出框map，决定弹出框是新增还是修改
      textMap: {
        update: '编辑站点',
        create: '添加站点',
        info: '贵宾厅详情'
      },
      // 列表查询对象
      listQuery: {
        // 查询的车站的ID
        stationId: undefined,
        // 第几页
        pageNum: 1,
        // 每页多少条
        pageSize: 10
      },
      // 指定站点贵宾厅列表
      VIPHallList: [
        {
          hallId: 1,
          hallName: '北京站悦途贵宾厅',
          hallType: '1',
          stationId: 1,
          businessHours: '08:30-22:00',
          servicePhone: '400-9209966',
          hallLocation: '北京站1楼一号候车室内“悦途出行 商务休息厅”',
          hallPic: 'http://www.baidu.com,http://iqiyi.com',
          hallStatus: '营业',
          services: []
        },
        {
          hallId: 2,
          hallName: '大兴国际机场高铁站',
          hallType: '1',
          stationId: 1,
          businessHours: '08:00-20:00',
          servicePhone: '400-9209966',
          hallLocation: '北京大兴国际机场航站楼B1层 商务座候车室',
          hallPic: 'http://www.baidu.com,http://youku.com',
          hallStatus: '营业',
          services: []
        }
      ]
    } //end return
  }, //end data
  created() {
    // 加载的时候获取对照表
    this.getComparisonList()
  }, // end created
  /* computed: {
    headers() {
      return {
        // Authorization: this.token // 直接从本地获取token就行
        // content-type:'multipart/form-data'
      }
    }
  }, //end computed */
  methods: {
    //
    uploadImage(params) {
      const formdata = new FormData()
      const file = params.file

      formdata.append('file', file)
      formdata.append('content', 'multipart/form-data')

      ossUpload(formdata)
    },
    // 上传图片函数
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 新增功能相关函数====================
    // 当点击“添加”按钮，显示添加的dialog
    handleCreate() {
      // 点击添加的时候需要先清空表单
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      // 还不具体理解，作用是清理表单的验证
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置添加表单
    resetTemp() {
      this.temp = {
        // 1 所属车站的ID
        stationId: '',
        // 2 贵宾厅类型
        hallType: '',
        // 3 贵宾厅的名称
        hallName: '',
        // 4 营业时间
        businessHours: '',
        // 5 服务电话
        servicePhone: '',
        // 6 贵宾厅的位置
        hallLocation: '',
        // 7 五星要客类型
        hallVisitors: '',
        // 8 快捷通道类型
        shortcutType: '',
        // 9 贵宾服务ID
        serviceId: [],
        // 10 贵宾厅图片
        hallPic: '',
        // 11 贵宾厅ID
        hallId: ''
      }
      // 重置时间服务时间
      this.startTime = ''
      this.endTime = ''
      // 重置厅内服务多选框
      this.serviceLabel = []
    },
    // 点击“确定”，确定添加贵宾厅
    createData() {
      console.log('成功触发添加')

      // 组装serviceID
      this.temp.serviceId = this.serviceLabel.join()

      this.$refs['dataForm'].validate(valid => {
        this.temp.businessHours = this.startTime + '-' + this.endTime
        console.log(valid)
        console.log(this.temp)
        // 如果验证成功,发送添加贵宾厅请求
        if (valid) {
          createVIPHall(this.temp).then(() => {
            // 将新增贵宾厅加到当前列表的最后,直接添加没有贵宾厅
            // this.VIPHallList.push(this.temp)
            // 添加成功之后直接发请求，刷一遍数据
            this.getVIPHallByStationId()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    // 删除功能相关函数=======================
    handleDelete(row) {
      console.log('进入删除函数')
      console.log(row.hallId)
      deleteVIPHall({ hallId: row.hallId }).then(() => {
        // 弹出删除成功提示框
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })

        // 将已经显示的列表中的对应位置的数据也删除
        const index = this.VIPHallList.indexOf(row)
        console.log(index)
        this.VIPHallList.splice(index, 1)
      })
    },

    // 查询功能相关函数=======================
    // 点击“搜索”按钮触发
    handleFilter() {
      // 不用传参数的原因，是因为直接传this.listQuery就可以了
      this.getVIPHallByStationId()
    },
    // 根据车站id获取贵宾厅信息
    getVIPHallByStationId() {
      getVIPHallByStationId(this.listQuery).then(res => {
        // console.log(res.data)
        // 将得到的数据赋予 VIPHallList
        this.VIPHallList = res.data
      })
    },
    // 获取车站和ID对照表
    getComparisonList() {
      getComparisonList().then(res => {
        // console.log(res.data)
        // 将得到的数据赋予 comparisonList
        this.comparisonList = res.data
      })
    },

    // 修改功能相关函数==========================
    // 当点击“编辑”按钮的时候，显示编辑的dialog
    handleUpdate(row) {
      // 先重置temp避免之前的数据污染
      this.resetTemp()
      // 显示编辑对话框
      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      // 获取对应的贵宾厅信息,并对this.temp数据赋值
      this.getVIPHallById({ stationId: row.stationId, hallId: row.hallId })

      // 清理表单的验证信息
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改大厅信息前从服务器获取对应的贵宾厅信息
    getVIPHallById(data) {
      getVIPHallById(data).then(res => {
        this.temp = { ...this.temp, ...res.data }
        // 将serviceLabel重置
        this.serviceLabel = []
        // 将services下的serviceID一数组形式push到serviceLabel中，以供多选框默认显示使用
        res.data.services.forEach(element => {
          this.serviceLabel.push(element.serviceId)
        })
        console.log('this.serviceLabel')
        console.log(this.serviceLabel)
        console.log('this.serviceLabel')
        // 处理businessHours字段，将获取的分割到starttime和endtime中
        let tempStr = res.data.businessHours.split('-')
        this.startTime = tempStr[0]
        this.endTime = tempStr[1]
        console.log(tempStr)
        console.log(this.startTime)
        console.log(this.endTime)
      })
    },
    // 点击“确定”，确定发送修改贵宾厅请求
    updateData() {
      console.log('成功触发修改')
      console.log(this.temp)
      // 组装temp.serviceId，就是serviceLabel.join()而来
      this.temp.serviceId = this.serviceLabel.join()

      this.$refs['dataForm'].validate(valid => {
        console.log(valid)

        if (valid) {
          console.log(this.temp)
          // 结构得到tempData是需要发送的数据
          let { services, hallStatus, ...tempData } = this.temp
          // 发送的数据函数中处理服务时间
          tempData.businessHours = this.startTime + '-' + this.endTime
          updateVIPHall(tempData).then(() => {
            // 修改请求发送成功之后，需要对本地的进行修改，
            for (const v of this.VIPHallList) {
              if (v.hallId == this.temp.hallId) {
                const index = this.VIPHallList.indexOf(v)
                this.VIPHallList.splice(index, 1, this.temp)
                break
              }
            }

            // 取消对话框的显示
            this.dialogFormVisible = false
            // 弹出提示信息
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    // 贵宾厅详细信息部分=========================
    // 点击“更多”按钮，进入贵宾厅详细信息页面
    handleInfo(row) {
      this.dialogStatus = 'info'
      this.dialogInfoVisible = true

      // 修改this.index，渲染大数组中对应的数据
      this.VIPHallList.forEach((element, index) => {
        if (row.hallId == element.hallId) {
          this.index = index
        }
      })
    }
  } //end methods
}
</script>

<style lang="scss" scoped>
//icon图标样式
i {
  color: #fff;
  border-radius: 15%;
  &.el-icon-time {
    background-color: orange;
  }
  &.el-icon-phone {
    background-color: pink;
  }
  &.el-icon-location {
    background-color: skyblue;
  }
}

//
.title {
  padding: 25px;
  font-weight: 700;
  font-size: 22px;
  text-align: center;
}
.time,
.phone,
.location {
  font-size: 18px;
  padding: 10px 30px 10px 30px;
  span {
    margin-left: 30px;
  }
}

// 增值服务
.servicesWrap {
  padding: 20px;
  display: flex;
  .services {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .imgWrap {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>

