import type { RouterOptions } from 'vue-router'
import type { constantRoutes } from '../router'
import type { ComponentPublicInstance } from 'vue'

export interface IOption {
  [key: string]: any
}
export interface routerArray extends RouterOptions {
  children: Array<any>
  component?: any
  redirect: string
  path: string
  permissions: Array<string>
  roles?: Array<string>
  hidden?: boolean
}
export declare type routerArrayType = typeof constantRoutes

export interface ITagView {
  name: string
  path: string
  meta: {
    title?: string
    affix?: boolean
    noCache?: boolean
  }
}
export interface IRouteLocation extends ITagView {
  query: any
}
export interface IComponentProxy extends ComponentPublicInstance {
  $modal: any
  resetForm: Function
}
export interface IAppQueryParams {
  searchValue?: string
}

export interface pageParams {
  pageNo: number
  pageSize: number
}

export interface IExpQueryParams extends pageParams {
  keyword?: string
  status?: number
  startTime?: string
  endTime?: string
  dateArr: Array<Date>
}
export interface IExpData {
  experimentId: string
  experimentName: string
  appName: string
  experimentType: number
  experimentStatus: number
  startTime: string
  endTime: string
  experimentTrafficWeight: number
  createTime: string
}
// 创建应用
export interface IAddApp {
  appName: string
  appType: number
  appDesc: string
  appKey: string
}
