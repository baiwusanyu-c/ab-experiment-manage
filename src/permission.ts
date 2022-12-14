import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import router from './router/index'
// @ts-ignore
import 'nprogress/nprogress.css'
import { getToken } from './utils/auth'
import { isHttp } from './utils/validate'
import { isRelogin } from './utils/request'
import useUserStore from './store/modules/user'
import useSettingsStore from './store/modules/settings'
import usePermissionStore from './store/modules/permission'
import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    NProgress.start()
    if (getToken()) {
      to.meta.title && useSettingsStore().setTitle(to.meta.title as string)
      /* has token*/
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        if (useUserStore().roles.length === 0) {
          isRelogin.show = true
          // 判断当前用户是否已拉取完user_info信息
          useUserStore()
            .getInfo()
            .then(() => {
              isRelogin.show = false
              usePermissionStore()
                .generateRoutes()
                .then((accessRoutes: any) => {
                  // 根据roles权限生成可访问的路由表
                  accessRoutes.forEach((route: { path: string }) => {
                    if (!isHttp(route.path)) {
                      router.addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
                    }
                  })
                  next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                })
            })
            .catch((err: Error) => {
              useUserStore()
                .logOut()
                .then(() => {
                  ElMessage.error(err)
                  next({ path: '/' })
                })
            })
        } else {
          next()
        }
      }
    } else {
      // 没有token
      if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        NProgress.done()
      }
    }
  }
)

router.afterEach(() => {
  NProgress.done()
})
