<template>
  <div class="site-container">
    <div class="app-container">
      <div class="filter-container">
        <el-container>
          <!-- 头部搜索框 -->
          <!-- <el-header height="50px" style="background-color:#0094ff; border: 1px solid yellow">搜索框</el-header> -->

          <!-- 中部主体部分 -->
          <el-container style="height:500px;overflow: hidden;">
            <!-- 左边站点列表 -->
            <el-aside width="200px" height="100vh" style="padding:0;background-color:#f4f4f4">
              <el-scrollbar style="height: 100%;">
                <div
                  class="listItem"
                  v-for="item in sitelist"
                  :key="item.province"
                >{{item.province}}</div>
              </el-scrollbar>
            </el-aside>

            <!-- 右边站点内容 -->
            <el-main>
              <div v-for="item in sitelist" :key="item.province">
                <div class="siteTitle pl-10">{{item.province}}</div>
                <br />
                <el-tag
                  class="stationName"
                  v-for="item in item.yuyueStations"
                  :key="item.id"
                  @click="clickStationName(item.id)"
                >{{item.stationName}}</el-tag>
              </div>
              <SiteDetail />
            </el-main>
          </el-container>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
//发送请求，获取数据
import { getSiteList, findStationsById } from '@/api/site'

// 注册组件
import SiteDetail from './components/SiteDetail'

export default {
  data() {
    return {
      // 车站内贵宾厅数据
      stationInfo: [],
      //站点列表数组
      sitelist: []
    }
  },
  components: {
    SiteDetail
  },
  created() {
    // 渲染页面时导入数据
    // type为1的时候，展示的是高铁的数据，现在还没有其他的数据，这里就写死了
    this.getSiteList({ type: 1 })
  },
  methods: {
    // 点击站点名进入站点详情
    clickStationName(id) {
      this.findStationsById(id)
    },
    // 获取站点列表数据
    getSiteList(data) {
      getSiteList(data).then(res => {
        // console.log(res)
        this.sitelist = res.data
      })
    },
    // 获取指定车站贵宾厅数据
    findStationsById(data) {
      findStationsById(data).then(res => {
        console.log(res)
        this.stationInfo = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pr-10 {
  padding-right: 10px;
}
.pl-10 {
  padding-left: 10px;
}

// 左侧列表
.listItem {
  text-align: center;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background-color: #fff;
    color: #af7f67;
  }
}

// 右侧内容
.siteTitle {
  border-left: 5px solid #af7f67;
}

.stationName {
  background-color: #f4f4f4;
  color: #000;
  border: none;
  margin: -10px 5px 10px 5px;
  cursor: pointer;
}
</style>
