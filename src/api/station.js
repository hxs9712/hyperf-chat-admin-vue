import request from '@/utils/request'

// 车站站点部分=======================================
// 获取车站信息列表
export function getStationList(data) {
  return request({
    url: '/yuyuetrip/station/listStationsNameInfos',
    method: 'post',
    data
  })
}

// 新增车站
export function createStation(data) {
  return request({
    url: '/yuyuetrip/station/saveYuyueStationInfo',
    method: 'post',
    data
  })
}

// 删除车站
export function deleteStation(data) {
  return request({
    url: '/yuyuetrip/station/delStationsNameInfo',
    method: 'post',
    data
  })
}

// 修改车站
export function updateStation(data) {
  return request({
    url: '/yuyuetrip/station/updateYuyueStationInfo',
    method: 'post',
    data
  })
}

// 通过id获取车站信息，在修改时加载数据时使用
export function getStationInfoById(data) {
  return request({
    url: '/yuyuetrip/station/getYuyueStationInfoById',
    method: 'post',
    data
  })
}

// 贵宾厅部分=========================================
// 获取贵宾厅通过站点id
export function getVIPHallByStationId(data) {
  return request({
    url: '/yuyuetrip/station/findStationsByIds',
    method: 'post',
    data
  })
}

// 删除大厅信息
export function deleteVIPHall(data) {
  return request({
    url: '/yuyuetrip/station/delYuyueStations',
    method: 'post',
    data
  })
}

// 修改大厅信息
export function updateVIPHall(data) {
  return request({
    url: '/yuyuetrip/station/updateYuyueStations',
    method: 'post',
    data
  })
}

// 修改大厅信息前从服务器获取对应的大厅信息
export function getVIPHallById(data) {
  return request({
    url: '/yuyuetrip/station/getYuyueStationsByhallId',
    method: 'post',
    data
  })
}

// 新增大厅信息
export function createVIPHall(data) {
  return request({
    url: '/yuyuetrip/station/saveYuyueStations',
    method: 'post',
    data
  })
}

// 厅内服务增删查改部分=====================

// 公共部分================================
// 获取所有站点和与之对应id的对照表
export function getComparisonList(data) {
  return request({
    url: '/yuyuetrip/station/getYuyueStationName',
    method: 'post',
    data
  })
}

// 图片上传
export function ossUpload(params) {
  return request({
    url: '/yuyuetrip/station/ossUpload',
    method: 'get',
    params
  })
}
