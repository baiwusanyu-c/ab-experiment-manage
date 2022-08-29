import request from '../../utils/request'
import type { IAddApp, IAppQueryParams, IExpQueryParams } from '../../utils/types'

export function addApplication(data: IAddApp) {
  return request({
    url: '/application/create',
    method: 'post',
    data,
  })
}

export function listApplication(data: IAppQueryParams) {
  return request({
    url: '/application/list',
    method: 'post',
    data,
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

export function cancelExperiment(data: { experimentId: number }) {
  return request({
    url: '/experiment/cancel',
    method: 'post',
    data,
  })
}

export function publishExperiment(data: { experimentId: number }) {
  return request({
    url: '/experiment/publish',
    method: 'post',
    data,
  })
}
