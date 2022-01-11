import request from '@/utils/request'

// 获取省份列表
export function getProvinces(params) {
  return request({
    url: '/yuyuetrip/areas/findYuyueProvinces',
    method: 'get',
    params
  })
}

// 通过省份id获取城市
export function getCityByProvinceid(params) {
  return request({
    url: '/yuyuetrip/areas/findYuyueCityByProvinceid',
    method: 'get',
    params
  })
}

// 查询国际站点
export function getInternational(params) {
  return request({
    url: '/yuyuetrip/areas/findYuyueInternational',
    method: 'get',
    params
  })
}
