import type { RouterOptions } from 'vue-router'
import type { constantRoutes } from '../router'

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
