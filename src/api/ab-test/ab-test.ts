import request from '../../utils/request'

// 创建应用
export interface IAddApp {
  appName: string
  appType: number
  appDesc: string
  appKey: string
}
export function addApplication(data: IAddApp) {
  return request({
    url: '/application/create',
    method: 'post',
    data,
  })
}

export function listApplication() {
  return request({
    url: '/application/list',
    method: 'post',
  })
}

export function getParameter() {
  return request({
    url: '/common/parameter/list',
    method: 'post',
  })
}
