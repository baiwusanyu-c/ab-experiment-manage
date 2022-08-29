import request from '../../utils/request'
import type { IAddApp, IExpQueryParams } from '../../utils/types'

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

export function listExperiment(data: IExpQueryParams) {
  return request({
    url: '/experiment/list',
    method: 'post',
    data,
  })
}
