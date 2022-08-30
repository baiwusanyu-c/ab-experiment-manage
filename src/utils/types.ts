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
  pageNum: number
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
  appId?: number | string
}

export interface IExpBaseInfo {
  experimentName?: string
  experimentDesc?: string
  experimentKey?: string
  appId?: string | number
  experimentType?: string | number
  startTime?: string
  endTime?: string
}

export interface IVersionInfo {
  experimentTrafficWeight?: number
  versions?: Array<IVersionInfoItem>
}

export interface IVersionInfoItem {
  versionName: string
  versionDesc: string
  versionType: number
  versionTrafficWeight: number
  versionParams: IVersionParams
  whitelist: string
}

export interface IVersionParams {
  paramName: string
  paramType: number
  paramValue: string
}
export interface IExpAddEditModel {
  baseInfo?: IExpBaseInfo
}
export declare type TExpAddEditFrom = IExpBaseInfo & IVersionInfo
