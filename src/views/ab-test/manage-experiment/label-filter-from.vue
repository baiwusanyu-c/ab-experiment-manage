<template>
  <div class="label-filter-form">
    <p
      class="op-btn"
      role="button"
      :class="filterFormList.length >= 20 ? 'txt__disabled' : ''"
      style="width: fit-content"
      @click="addItem">
      + 添加筛选
    </p>
    <div class="filter-col">
      <and-or v-if="filterFormList.length > 1"></and-or>
      <div>
        <div v-for="(item, index) in filterFormList">
          <label-filter-from-item
            v-if="item.filter.length === 0"
            v-model="filterFormList[index]"
            :option="{ isFilter: false, index }"
            :show-add="filterFormList.length > 1"
            @delete="deleteItem"
            @add="addFilterItem" />
          <div v-show="item.filter.length > 0" class="filter-col">
            <and-or></and-or>
            <div>
              <label-filter-from-item
                v-for="(filterItems, filterIndex) in item.filter"
                v-model="filterFormList[index].filter[filterIndex]"
                :option="{ isFilter: true, index, filterIndex }"
                :show-add="filterIndex === 0 && item.filter.length < 20"
                @delete="deleteItem"
                @add="addFilterItem" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <span v-if="verInfo" class="label-filter--text__error">{{ verInfo }}</span>
  </div>
</template>

<script lang="ts" setup name="LabelFilterFrom">
  import { getCurrentInstance, ref, watch } from 'vue'
  import AndOr from '../../../components/AndOr'
  import { jsonClone } from '../../../utils/ruoyi'
  import LabelFilterFromItem from './label-filter-from-item.vue'
  import type { IComponentProxy, IFilterItem, IFilterItemOption } from '../../../utils/types'

  const proxy = getCurrentInstance()?.proxy
  // TODO: 且或
  // TODO: 父级注入最终表单变量
  // TODO: 表單數據結構轉換
  // TODO: 編輯時數據結構轉換
  // TODO: 编辑
  // TODO: 创建
  // TODO: 各个类型labelValue 测试
  const mock = [
    {
      labelName: {
        labelId: '1',
        label: 'userCity',
      },
      labelValue: ['杭州', '成都', '广州'],
      relateId: 'relative_time',
      loading: false,
      filter: [],
    },
  ] as Array<IFilterItem>
  const filterFormList = ref<Array<IFilterItem>>([])
  const filterItem = {
    labelName: {
      labelId: '',
      label: '',
    },
    relateId: '',
    labelValue: [],
    loading: false,
    filter: [],
  } as IFilterItem

  const verInfo = ref<string>('')
  const verForm = () => {
    verInfo.value = ''
    if (filterFormList.value.length === 0) {
      verInfo.value = '请添加筛选条件'
      return
    }

    const verItem = (item: IFilterItem) => {
      if (!item.labelName.labelId) {
        verInfo.value = '请添加标签'
        return
      }
      if (!item.relateId || item.labelValue.length === 0) {
        verInfo.value = '请完善条件规则'
      }
    }
    filterFormList.value.forEach((val: IFilterItem) => {
      if (val.filter.length === 0) {
        verItem(val)
      } else {
        val.filter.forEach((filterVal: IFilterItem) => {
          verItem(filterVal)
        })
      }
    })
  }

  const init = () => {
    verForm()
  }
  init()

  watch(filterFormList.value, () => {
    // 校验
    verForm()
    // 转换结构，赋值到父级表单
  })
  /******************************************* 增刪 item ******************************************/

  /**
   * 增加筛选选项
   * @param option
   */
  const addFilterItem = (option: IFilterItemOption) => {
    const { isFilter, index } = option
    const item = jsonClone(filterItem)
    if (!isFilter) {
      // 从一层转化为二层，先将一层的item放入二层，
      const topItem = jsonClone(filterFormList.value[index])
      filterFormList.value[index].filter.push(topItem)
      filterFormList.value[index].filter.push(item)
      return
    }
    if (filterFormList.value[index].filter.length >= 20) {
      ;(proxy! as IComponentProxy).$modal.msgError('不可超过 20 个')
      return
    }
    filterFormList.value[index].filter.push(item)
  }

  /**
   * 删除筛选选项
   * @param option
   */
  const deleteItem = (option: IFilterItemOption) => {
    const { isFilter, index, filterIndex } = option
    // 删除第一层
    if (!isFilter) {
      filterFormList.value.splice(index, 1)
      // 第一层只剩一个，则需要将第二层的转化为第一层
      if (filterFormList.value.length === 1 && filterFormList.value[0].filter.length > 0) {
        filterToTopItem(0)
      }
      return
    }
    // 删除第二层，
    filterFormList.value[index].filter.splice(filterIndex!, 1)
    // 如果删除后第二层只剩一个，则需要将第二层的转化为第一层
    if (filterFormList.value[index].filter.length === 1) {
      filterToTopItem(index)
    }
  }

  /**
   * 增加筛选
   */
  const addItem = () => {
    if (filterFormList.value.length >= 20) {
      ;(proxy! as IComponentProxy).$modal.msgError('不可超过 20 个')
      return
    }
    filterFormList.value.push(jsonClone(filterItem))
  }
  /**
   * 第二层数据切换到第一层
   * @param index
   */
  const filterToTopItem = (index: number) => {
    filterFormList.value[index].filter.forEach((val: typeof filterItem, index) => {
      if (index !== 0) {
        filterFormList.value.push(val)
      }
    })
    filterFormList.value[index] = jsonClone(filterFormList.value[index].filter[0])
    filterFormList.value[index].filter = []
  }
</script>

<style lang="scss">
  .label-filter-form {
    .filter-col {
      height: auto;
      margin: 1rem 0;
      min-height: 60px;
      display: flex;
      flex-direction: row;
    }
    .label-filter--text__error {
      font-size: 12px;
      color: #f56c6c;
    }
    .txt__disabled {
      cursor: not-allowed;
      color: #999;
    }
  }
</style>
