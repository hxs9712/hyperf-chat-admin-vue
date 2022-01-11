import request from '@/utils/request'

export function getSiteList(data) {
  return request({
    url: '/yuyuetrip/station/findStationsName',
    method: 'post',
    data
  })
}

export function findStationsById(data) {
  return request({
    url: '/yuyuetrip/station/findStationsByIds',
    method: 'post',
    data: { stationId: data }
  })
}

