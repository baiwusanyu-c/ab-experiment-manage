import { defineStore } from 'pinia'
import { useEventBus } from '@vueuse/core'
import { getParameter } from '../../api/ab-test/ab-test'
import type { IOption } from '../../utils/types'
export interface IExpType {
  1?: string // 客户端
  2?: string // 服务端
}
export interface IVerType {
  1?: string // 客户端
  2?: string // 服务端
}
export interface IParamType {
  1?: string // string
  2?: string // number
  3?: string // boolean
}
export interface IExpStatus {
  1?: string // 待发布 -> 编辑、发布
  2?: string // 待运行 -> 编辑、取消
  3?: string // 运行中 -> 查看报告、编辑、取消
  4?: string // 已取消 -> 查看报告
  5?: string // 已结束 -> 查看报告
}
export interface IAppType {
  1?: string // 微信小程序
  2?: string // 抖音小程序
  3?: string // H5
}
export interface ICommonParams {
  EXPERIMENT_TYPE?: IExpType
  VERSION_TYPE?: IVerType
  PARAM_TYPE?: IParamType
  EXPERIMENT_STATUS?: IExpStatus
  APP_TYPE?: IAppType
}
const useCommonParamsStore = defineStore('common-params', {
  state: () => ({
    commonParams: {} as ICommonParams,
  }),
  getters: {
    getParams() {
      return (attrKey: string) => {
        return this.commonParams[attrKey]
      }
    },
  },
  actions: {
    async reqParams() {
      function getParam() {
        return new Promise((resolve, reject) => {
          getParameter()
            .then((res: any) => {
              resolve(res.data)
            })
            .catch((error: Error) => {
              reject(error)
            })
        })
      }
      const bus = useEventBus<string>('commonParams')
      this.commonParams = await getParam()
      bus.emit()
    },
    createOption(attrKey: string) {
      const option: Array<IOption> = []
      let index = 0
      for (const key in this.commonParams[attrKey]) {
        option[index] = {
          label: this.commonParams[attrKey][key],
          value: Number(key),
        }
        index++
      }
      return option
    },
  },
})

export default useCommonParamsStore
