<template>
  <div class="userlist-container">
    <div class="app-container">
      <div class="filter-container">
        <div style="margin:30px" v-for="item in stationInfo" :key="item.hallName">
          <div class="title">{{item.hallName}}</div>
          <div class="time">
            <i class="el-icon-time" style="backgorund-color:orange" />
            <span>营业时间 ： {{item.businessHours}}</span>
          </div>
          <div class="phone">
            <i class="el-icon-phone" style="backgorund-color:pink" />
            <span>服务电话 ： {{item.servicePhone}}</span>
          </div>
          <div class="location">
            <i class="el-icon-location" style="backgorund-color:skyblue" />
            <span>站厅位置 ： {{item.hallLocation}}</span>
          </div>
          <div class="servicesWrap">
            <div class="services" v-for="item in item.services" :key="item.serviceId">
              <div class="imgWrap">
                <img :src="item.serviceIcon" :alt="item.serviceName" />
              </div>
              <span>{{item.serviceName}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 站点详情数组,这些数据可以从父组件中传入
      stationInfo: [
        {
          hallName: '北京站悦途贵宾厅',
          businessHours: '08:30-22:00',
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
      ]
    }
  }
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
  font-weight: 700;
  font-size: 22px;
  text-align: center;
}
.time,
.phone,
.location {
  font-size: 18px;
  margin: 20px;
  span {
    margin-left: 30px;
  }
}

// 增值服务
.servicesWrap {
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
