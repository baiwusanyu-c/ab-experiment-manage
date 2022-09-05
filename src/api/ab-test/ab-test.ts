import request from '../../utils/request'
import type { IAddApp, IAppQueryParams, IExpQueryParams, TExpAddEditFrom } from '../../utils/types'

export function addApplication(data: IAddApp) {
  return request({
    url: '/application/create',
    method: 'post',
    data,
  })
}

export function editApplication(data: IAddApp) {
  return request({
    url: '/application/update',
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

export function detailApplication(data: { appId: string }) {
  return request({
    url: '/application/detail',
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

export function createExperiment(data: TExpAddEditFrom) {
  return request({
    url: '/experiment/create',
    method: 'post',
    data,
  })
}

export function editExperiment(data: TExpAddEditFrom) {
  return request({
    url: '/experiment/update',
    method: 'post',
    data,
  })
}

export function detailExperiment(data: { experimentId: string | number }) {
  return request({
    url: 'experiment/detail',
    method: 'post',
    data,
  })
}

export function reportOverview(data: { experimentId: string | number }) {
  return request({
    url: 'report/overview',
    method: 'post',
    data,
  })
}

export function indicatorsList(data: { experimentId: string | number }) {
  return request({
    url: 'indicators/list',
    method: 'post',
    data,
  })
}

export function indicatorsReport(data: { indicatorsName: string; experimentId: string }) {
  return request({
    url: 'report/indicators',
    method: 'post',
    data,
  })
}
