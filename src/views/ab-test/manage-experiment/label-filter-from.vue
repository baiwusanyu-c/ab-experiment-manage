<template>
  <div class="label-filter-form">
    <div class="filter-col">
      <and-or v-if="filterFormList.length > 1"></and-or>
      <div>
        <div v-for="(item, index) in filterFormList">
          <label-filter-from-item
            v-if="item.filter.length === 0"
            v-model="filterFormList[index]"
            :option="{ isFilter: false, index }"
            :show-add="filterFormList.length > 1"
            :relation-option="relationOption"
            @delete="deleteItem"
            @add="addFilterItem" />
          <div v-show="item.filter.length > 0" class="filter-col">
            <and-or></and-or>
            <div>
              <label-filter-from-item
                v-for="(filterItems, filterIndex) in item.filter"
                v-model="filterFormList[index].filter[filterIndex]"
                :option="{ isFilter: true, index, filterIndex }"
                :show-add="filterIndex === 0"
                :relation-option="relationOption"
                @delete="deleteItem"
                @add="addFilterItem" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="op-btn" role="button" style="width: fit-content" @click="addItem">+ 添加筛选</p>
  </div>
</template>

<script lang="ts" setup name="LabelFilterFrom">
  import { ref } from 'vue'
  import AndOr from '../../../components/AndOr'
  import { jsonClone } from '../../../utils/ruoyi'
  import LabelFilterFromItem from './label-filter-from-item.vue'
  import type { IFilterItem, IFilterItemOption, IRelationOption } from '../../../utils/types'

  // TODO: 且或
  // TODO: 父级注入最终表单变量
  // TODO: 列表獲取
  // TODO: 表單數據結構轉換
  // TODO: 編輯時數據結構轉換
  // TODO: 表单校验
  // TODO: 编辑
  // TODO: 创建
  const mock = [
    {
      labelName: {
        labelId: '1',
        label: 'test1',
      },
      labelValue: ['杭州', '成都', '广州'],
      relateId: '1',
      loading: false,
      filter: [],
    },
  ] as Array<IFilterItem>
  const filterFormList = ref<Array<IFilterItem>>(mock)
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
    if (filterFormList.value[index].filter.length >= 20) return
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
    if (filterFormList.value.length >= 20) return
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

  /******************************************* 关系规则 ******************************************/
  const relationOption = ref<Array<IRelationOption>>([])
  /**
   * 获取关系规则列表
   */
  const getRelateOption = () => {
    relationOption.value = [
      {
        label: 'test1',
        function: '1',
      },
      {
        label: 'test2',
        function: '2',
      },
    ]
  }
  getRelateOption()
</script>

<style lang="scss">
  .label-filter-form {
    .filter-col {
      height: auto;
      margin: 1rem 0;
      min-height: 100px;
      display: flex;
      flex-direction: row;
    }
  }
</style>
