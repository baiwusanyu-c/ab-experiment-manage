import auth from '../../plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '../../router'
import { getRouters } from '../../api/menu'
import Layout from '../../layout/index.vue'
import ParentView from '../../components/ParentView/index.vue'
import InnerLink from '../../layout/components/InnerLink/index.vue'
import {defineStore} from "pinia";
import {RouterOptions} from "vue-router";
// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')
interface routerArray extends RouterOptions {
  children:Array<any>,
  component?:any
  redirect:string
  path:string
  permissions:Array<string>,
  roles?:Array<string>,
  hidden?: boolean,

}
declare type routerArrayType  = typeof constantRoutes
const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [],
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes:routerArrayType) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      setDefaultRoutes(routes:routerArrayType) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      setTopbarRoutes(routes:RouterOptions) {
        this.topbarRouters = routes
      },
      setSidebarRouters(routes:RouterOptions) {
        this.sidebarRouters = routes
      },
      generateRoutes() {
        return new Promise(resolve => {
          // 向后端请求路由数据
          getRouters().then((res:any) => {
            const sdata = JSON.parse(JSON.stringify(res.data))
            const rdata = JSON.parse(JSON.stringify(res.data))
            const defaultData = JSON.parse(JSON.stringify(res.data))
            const sidebarRoutes = filterAsyncRouter(sdata) as routerArrayType
            const rewriteRoutes = filterAsyncRouter(rdata, false, true)
            const defaultRoutes = filterAsyncRouter(defaultData)

            const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
            asyncRoutes.forEach(route => { router.addRoute(route) })
            this.setRoutes(rewriteRoutes)
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
            this.setDefaultRoutes(sidebarRoutes)
            this.setTopbarRoutes(defaultRoutes)
            resolve(rewriteRoutes)
          })
        })
      }
    }
  })


// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap:Array<routerArray>, lastRouter:any = false, type = false) {
  return asyncRouterMap.filter((route:routerArray) => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component as string)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children' as keyof typeof route]
      delete route['redirect' as keyof typeof route]
    }
    return true
  })
}

function filterChildren(childrenMap:Array<routerArray>, lastRouter:any = false) {
  let children:Array<any> = []
  childrenMap.forEach((el) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c:any) => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes: Array<any>) {
  const res:Array<any> = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view:string) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
}

export default usePermissionStore
