import { ref, toRefs } from 'vue'
import useDictStore from '../store/modules/dict'
import { getDicts } from '../api/system/dict/data'
import type { IOption } from './types'

interface IDict {
  dictLabel: string
  dictValue: string
  listClass: string
  cssClass: string
}
/**
 * 获取字典数据
 */
export function useDict(...args: Array<any>) {
  const res = ref<IOption>({})
  return (() => {
    args.forEach((dictType: string) => {
      res.value[dictType] = []
      const dicts = useDictStore().getDict(dictType)
      if (dicts) {
        res.value[dictType] = dicts
      } else {
        getDicts(dictType).then((resp: any) => {
          res.value[dictType] = resp.data.map((p: IDict) => ({
            label: p.dictLabel,
            value: p.dictValue,
            elTagType: p.listClass,
            elTagClass: p.cssClass,
          }))
          useDictStore().setDict(dictType, res.value[dictType])
        })
      }
    })
    return toRefs(res.value)
  })()
}
