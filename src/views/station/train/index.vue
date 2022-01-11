<template>
  <div class="userlist-container">
    <div class="app-container">
      <!-- 条件搜索部分 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.stationName"
          placeholder="站点名称"
          style="width: 200px;"
          class="filter-item"
        ></el-input>
        <el-select
          v-model="listQuery.provinceId"
          filterable
          clearable
          class="filter-item"
          placeholder="请选择所属省份"
        >
          <el-option
            v-for="item in provinceOption"
            :key="item.provinceid"
            :label="item.province"
            :value="item.provinceid"
          />
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
        :data="stationList"
        style="width: 100%"
        :default-sort="{prop: 'stationId'}"
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="stationId" label="站点序号" sortable="custom" width="180"></el-table-column>
        <el-table-column prop="stationName" label="站点名称" width="180"></el-table-column>
        <el-table-column prop="province" label="所属省份" width="180"></el-table-column>
        <el-table-column prop="hallCount" label="站内厅数" width="180"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button v-waves type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button v-waves size="mini" type="danger" @click="handleDelete(row)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getStationList"
      />

      <!-- 新增和修改数据弹出框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="80px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="网点类型" prop="type">
            <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
              <el-option
                v-for="item in siteType"
                :key="item.type"
                :label="item.siteName"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="站点名称" prop="stationName">
            <el-input v-model="temp.stationName" />
          </el-form-item>
          <el-form-item label="所属省份" prop="province">
            <el-select
              v-model="temp.provinceId"
              class="filter-item"
              placeholder="请选择"
              @change="handleChange"
            >
              <el-option
                v-for="item in provinceOption"
                :key="item.provinceid"
                :label="item.province"
                :value="item.provinceid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所在城市" prop="city">
            <el-select v-model="temp.cityId" class="filter-item" placeholder="请先选择所属省份">
              <el-option
                v-for="item in cityOption"
                :key="item.cityid"
                :label="item.city"
                :value="item.cityid"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        </div>
      </el-dialog>

      <!-- 测试区域 -->
      <div>
        <!-- <el-cascader v-model="value" :options="options" @change="handleChange" :props="props"></el-cascader> -->
        <!-- <el-cascader :props="props"></el-cascader> -->
      </div>
    </div>
    <!-- end app-container -->
  </div>
</template>

<script>
// 引入数据请求
import {
  getStationList,
  createStation,
  updateStation,
  deleteStation,
  getStationInfoById
} from '@/api/station'
import { getProvinces, getCityByProvinceid } from '@/api/area'
// 引入水波纹效果指令
import waves from '@/directive/waves' // waves directive
// 引入时间格式化工具
// import { parseTime } from '@/utils'
// 引入分页组件
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 測試數據
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: [],
      // 城市选择
      cityOption: [],
      // 省份选择
      provinceOption: [],
      // 网点类型
      siteType: [
        {
          type: '1',
          siteName: '火车/高铁'
        },
        {
          type: '2',
          siteName: '国内机场'
        },
        {
          type: '3',
          siteName: '国际网点'
        }
      ],
      // 弹出框表单渲染数据
      temp: {
        type: '',
        id: '',
        stationName: '',
        province: '',
        city: '',
        provinceid: '',
        cityid: ''
      },
      // 弹出框表单验证规则
      rules: {
        type: [{ required: true, message: '所属类型未填写', trigger: 'blur' }],
        stationName: [
          { required: true, message: '站点名称未填写', trigger: 'blur' }
        ],
        provinceId: [
          { required: true, message: '所属省份未填写', trigger: 'blur' }
        ],
        cityId: [{ required: true, message: '所属城市未填写', trigger: 'blur' }]
      },
      // 弹出框显示状态
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑站点',
        create: '添加站点'
      },
      // 贵宾厅数据
      stationInfo: [
        {
          hallName: '北京站悦途贵宾厅',
          营业Hours: '08:30-22:00',
          servicePhone: '400-9209966',
          hallLocation: '北京站1楼一号候车室内“悦途出行 商务休息厅”',
          hallPic: 'http://www.baidu.com,http://iqiyi.com',
          services: [
            {
              serviceId: 1,
              serviceName: 'WI-Fi',
              serviceIcon:
                'https://yue-public-1256591252.cos.ap-beijing.myqcloud.com/res/platform/svc/pictures/952bbe5a9a4442a48f9b2b25f96e621f.jpg',
              serviceType: 1
            },
            {
              serviceId: 2,
              serviceName: '精美茶点',
              serviceIcon:
                'https://yue-public-1256591252.cos.ap-beijing.myqcloud.com/res/platform/svc/pictures/ed1a50204eb445b189c1508fd2792fc0.jpg',
              serviceType: 2
            },
            {
              serviceId: 3,
              serviceName: '免费喝饮料',
              serviceIcon:
                'https://yue-public-1256591252.cos.ap-beijing.myqcloud.com/res/platform/svc/pictures/43025edc-56cd-43b9-aff4-748a74faf1f5.jpg',
              serviceType: 1
            }
          ]
        },
        {
          hallName: '大兴国际机场高铁站',
          businessHours: '08:00-20:00',
          servicePhone: '400-9209966',
          hallLocation: '北京大兴国际机场航站楼B1层 商务座候车室',
          hallPic: 'http://www.baidu.com,http://youku.com',
          services: [
            {
              serviceId: 1,
              serviceName: 'WI-Fi',
              serviceIcon:
                'https://yue-public-1256591252.cos.ap-beijing.myqcloud.com/res/platform/svc/pictures/952bbe5a9a4442a48f9b2b25f96e621f.jpg',
              serviceType: 1
            },
            {
              serviceId: 2,
              serviceName: '精美茶点',
              serviceIcon:
                'https://yue-public-1256591252.cos.ap-beijing.myqcloud.com/res/platform/svc/pictures/ed1a50204eb445b189c1508fd2792fc0.jpg',
              serviceType: 2
            }
          ]
        }
      ],
      // 列表查询对象
      listQuery: {
        // 查询类别
        type: 1,
        // 所属省份
        provinceId: undefined,
        // 车站名称
        stationName: undefined,
        // 第几页
        pageNum: 1,
        // 每页多少条
        pageSize: 10
      },
      // 数据总数目
      total: 0,
      // 站点列表
      stationList: []
    }
  }, // end data
  created() {
    // 渲染页面时导入数据
    this.getStationList()

    // 实现获取省份数据给搜索功能的下拉框展示省份
    this.getProvinces()
  }, // end created
  methods: {
    // 添加表单中，省份选择之后，加载城市的数据
    handleChange(value) {
      this.getCityByProvinceid({ provinceid: value })
    },
    // 处理删除
    handleDelete(row) {
      console.log('进入删除函数')
      console.log(row.stationId)

      // 真实删除
      console.log(typeof row.stationId)
      let tempData = Number(row.stationId)
      console.log(typeof tempData)
      deleteStation({ id: tempData }).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })

        // 将已经显示的列表中的对应位置的数据也删除
        const index = this.stationList.indexOf(row)
        console.log(index)
        this.stationList.splice(index, 1)
      })
    },
    // 重置添加/修改表单
    resetTemp() {
      this.temp = {
        type: '',
        id: '',
        stationName: '',
        province: '',
        city: '',
        provinceid: '',
        cityid: ''
      }
    },
    // 根据id查找车站信息
    getStationInfoById(data) {
      getStationInfoById(data).then(res => {
        console.log('根据id查找车站信息')
        console.log(res)
        this.temp = res.data
      })
    },

    // 发送请求，修改车站数据
    updateStation(data) {
      updateStation(data).then(res => {
        console.log('修改车站函数')
        console.log(res)
      })
    },
    // 确定修改
    updateData() {
      console.log('成功触发修改')

      this.$refs['dataForm'].validate(valid => {
        console.log(valid)
        if (valid) {
          const tempData = Object.assign({}, this.temp)

          updateStation(tempData).then(() => {
            console.log('进入updateStation的then')
            console.log(this.stationList)
            console.log(this.temp)
            for (const v of this.stationList) {
              if (v.stationId == this.temp.id) {
                const index = this.stationList.indexOf(v)
                this.stationList.splice(index, 1, this.temp)
                break
              }
            }
            console.log('进入updateStation的then，并且本地修改成功')
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
    // 确定添加
    createData() {
      console.log('成功触发添加')

      this.$refs['dataForm'].validate(valid => {
        console.log(valid)
        console.log(this.temp)

        const tempCreatData = Object.assign({}, this.temp)

        // 删除值为null的键值对
        for (var key in tempCreatData) {
          if (tempCreatData[key] === '') {
            delete tempCreatData[key]
          }
        }
        console.log(tempCreatData)

        if (valid) {
          createStation(tempCreatData).then(() => {
            // 将新增的信息插入到当前的列表中,怎么查都不对，先不插入
            // this.stationList.push(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            // 干脆点，成功添加之后直接重新发一次请求，刷新一次页面
            this.getStationList()
          })
        }
      })
    },
    // 处理编辑按钮
    handleUpdate(row) {
      //  复制对象，
      // this.temp = Object.assign({}, row)
      // console.log(temp)

      // 显示编辑对话框
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      console.log(row.stationId)

      // 获取要修改的车站信息，并将temp重置为返回的信息
      this.getStationInfoById({ id: row.stationId })

      // 要加载省市区三级联动
      this.getProvinces()

      // 处理清理表单
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理添加按钮
    handleCreate() {
      // 点击添加的时候需要先清空表单
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      // 加载省市区三级联动
      this.getProvinces()

      // 还不具体理解，作用是清理表单
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理搜索功能
    handleFilter() {
      // 点击搜索，就是触发这个handleFilter，然后把页面调回第一页，然后再getList
      this.listQuery.pageNum = 1
      this.getStationList()
    },
    // 获取站点列表
    getStationList() {
      getStationList(this.listQuery).then(res => {
        // console.log(res)
        // 车站数据
        this.stationList = res.data
        // 数据总数目
        this.total = res.total
      })
    },
    deleteStation(data) {
      deleteStation(data).then(res => {
        console.log(res)
      })
    },
    // 获取省份,并赋值给对应的数组
    getProvinces() {
      getProvinces().then(res => {
        // console.log(res)
        this.provinceOption = res.data
      })
    },
    // 获取城市通过省id
    getCityByProvinceid(params) {
      getCityByProvinceid(params).then(res => {
        console.log(res)
        this.cityOption = res.data
      })
    }
  } //end methods
}
</script>

<style lang="scss" scoped>
</style>
