import { defineStore } from 'pinia'
import { getParameter } from '../../api/ab-test/ab-test'
import type { IOption } from '../../utils/types'

interface ICommonParams {
  EXPERIMENT_TYPE?: {
    1: string // 客户端
    2: string // 服务端
  }
  VERSION_TYPE?: {
    0: string // 对照版本
    1: string // 实验版本
  }
  PARAM_TYPE?: {
    1: string // string
    2: string // number
    3: string // boolean
  }
  EXPERIMENT_STATUS?: {
    1: string // 待发布
    2: string // 待运行
    3: string // 运行中
    4: string // 已取消
    5: string // 已结束
  }
  APP_TYPE?: {
    1: string // 微信小程序
    2: string // 抖音小程序
    3: string // H5
  }
}
const useCommonParamsStore = defineStore('common-params', {
  state: () => ({
    commonParams: {} as ICommonParams,
  }),
  actions: {
    reqParams() {
      return new Promise((resolve, reject) => {
        getParameter()
          .then((res: any) => {
            this.commonParams = res.data
            resolve('')
          })
          .catch((error: Error) => {
            reject(error)
          })
      })
    },
    getParams(attrKey: string) {
      return this.commonParams[attrKey]
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
