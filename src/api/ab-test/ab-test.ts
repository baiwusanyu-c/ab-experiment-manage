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
    url: '/application',
    method: 'post',
    data,
  })
}
