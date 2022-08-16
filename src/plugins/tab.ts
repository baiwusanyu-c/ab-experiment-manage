import useTagsViewStore from '../store/modules/tagsView'
import router from '../router'
import {IRouteLocation, ITagView} from "../utils/types";

export default {
  // 刷新当前tab页签
  refreshPage(obj:IRouteLocation) {
    const { path, query, matched } = router.currentRoute.value;
    if (obj === undefined) {
      matched.forEach((m) => {
        if (m.components && m.components.default && m.components.default.name) {
          if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
            obj = { name: m.components.default.name, path: path, query: query,meta:{}};
          }
        }
      });
    }
    return useTagsViewStore().delCachedView(obj).then(() => {
      const { path, query } = obj
      router.replace({
        path: '/redirect' + path,
        query: query
      })
    })
  },
  // 关闭当前tab页签，打开新页签
  closeOpenPage(obj:IRouteLocation) {
    useTagsViewStore().delView(router.currentRoute.value as ITagView);
    if (obj !== undefined) {
      return router.push(obj);
    }
  },
  // 关闭指定tab页签
  closePage(obj:IRouteLocation) {
    if (obj === undefined) {
      return useTagsViewStore().delView(router.currentRoute.value as ITagView).then(({ lastPath }:any) => {
        return router.push(lastPath || '/index');
      });
    }
    return useTagsViewStore().delView(obj);
  },
  // 关闭所有tab页签
  closeAllPage() {
    return useTagsViewStore().delAllViews();
  },
  // 关闭左侧tab页签
  closeLeftPage(obj:IRouteLocation) {
    return useTagsViewStore().delLeftTags(obj || router.currentRoute.value);
  },
  // 关闭右侧tab页签
  closeRightPage(obj:IRouteLocation) {
    return useTagsViewStore().delRightTags(obj || router.currentRoute.value);
  },
  // 关闭其他tab页签
  closeOtherPage(obj:IRouteLocation) {
    return useTagsViewStore().delOthersViews(obj || router.currentRoute.value);
  },
  // 打开tab页签
  openPage(url:string) {
    return router.push(url);
  },
  // 修改tab页签
  updatePage(obj:IRouteLocation) {
    return useTagsViewStore().updateVisitedView(obj);
  }
}
