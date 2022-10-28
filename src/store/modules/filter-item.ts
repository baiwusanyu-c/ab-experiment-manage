import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IFilerFrom, IFilterLbName } from '../../utils/types'

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
