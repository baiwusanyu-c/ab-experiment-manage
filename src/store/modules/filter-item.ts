import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IFilerFrom, IFilterLbName } from '../../utils/types'

// 提供一个option，用于select，避免每个组件渲染都是独立的 option
// 否则组件层级转换后，由于option是新的，导致回显失败
export const useLabelNameOption = defineStore('routerInfo', () => {
  const labelNameOption = ref<Array<IFilterLbName>>([])
  const setLabelNameOption = (data: Array<IFilterLbName>) => {
    labelNameOption.value = data
  }

  const filterItemFrom = ref<IFilerFrom>({})

  const setFilterItemFrom = (data: IFilerFrom) => {
    filterItemFrom.value = data
  }

  const getFilterItemFrom = (): IFilerFrom => {
    return filterItemFrom.value
  }
  return {
    labelNameOption,
    setFilterItemFrom,
    filterItemFrom,
    setLabelNameOption,
    getFilterItemFrom,
  }
})
