<template>
  <div
    v-loading="loadingLV"
    class="label-filter-form--item"
    @mouseenter="showOp = true"
    @mouseleave="showOp = false">
    <el-select
      v-model="itemInner.labelName"
      filterable
      remote
      reserve-keyword
      placeholder="请选择标签名称"
      remote-show-suffix
      value-key="labelId"
      :remote-method="query => remoteMethod(query, itemInner)"
      :loading="itemInner.loading"
      @change="handleChange('name')">
      <el-option
        v-for="labelItem in storeLabelNameOption.labelNameOption"
        :key="labelItem.labelId + 'labelItem'"
        :value="labelItem"
        :label="labelItem.label" />
    </el-select>
    <el-select
      v-model="itemInner.relateId"
      :disabled="!!!itemInner.labelName.labelId"
      placeholder="筛选关系"
      class="relate-select"
      @change="handleChange('function')">
      <el-option
        v-for="labelItem in relationOptionInner"
        :label="labelItem.label"
        :value="labelItem.function" />
    </el-select>
    <!--   新增时，先选名称，在调接口获取 labelValueOption ？ 编辑时，已知名称数据，直接调接口？但是一开始怎么回显数据？ -->
    <el-select
      v-model="itemInner.labelValue"
      :disabled="!!!itemInner.relateId"
      multiple
      filterable
      placeholder="请选择标签值"
      :remote-method="query => getLabelValueOption(query, itemInner)"
      :loading="itemInner.loading"
      @change="handleChange">
      <el-option
        v-for="labelItem in labelValueOption"
        :label="labelItem.labelNameCN"
        :value="labelItem.labelNameCN" />
    </el-select>
    <el-icon v-show="showOp" role="button" class="op-btn__text" @click="handleAddOrDelete('delete')"
      ><Close
    /></el-icon>
    <div
      v-show="showAdd && showOp"
      role="button"
      class="op-btn__text"
      @click="handleAddOrDelete('add')">
      <el-icon style="margin-right: 0.1rem"><Plus /></el-icon>
      <span>且并满足</span>
    </div>
  </div>
</template>

<script lang="ts" setup name="LabelFilterFromItem">
  import { nextTick, ref, watch } from 'vue'
  import store from '../../../store'
  import { useLabelNameOption } from '../../../store/modules/filter-item'
  import type {
    IFilterItem,
    IFilterItemOption,
    IFilterLabelValItem,
    IRelationOption,
  } from '../../../utils/types'
  import type { PropType } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Object as PropType<IFilterItem>,
    },
    relationOption: {
      type: Array as PropType<Array<IRelationOption>>,
      default: () => [],
    },
    showAdd: {
      type: Boolean,
      default: false,
    },
    option: {
      type: Object as PropType<IFilterItemOption>,
    },
  })

  const emit = defineEmits(['update:modelValue', 'add', 'delete'])
  const itemInner = ref<IFilterItem>(props.modelValue!)
  const showOp = ref<boolean>(false)
  watch(
    () => props.modelValue,
    (n, o) => {
      if (n !== o) {
        itemInner.value = n as IFilterItem
        nextTick(() => {
          updateOptions()
        })
      }
    },
    {
      immediate: true,
    }
  )
  /**
   * 双向绑定
   */
  const handleChange = (type: string) => {
    emit('update:modelValue', itemInner.value)
    // 标签名称选择后，根据选择结果，筛选出 relationOption、获取 labelValueOption
    if (type === 'name') {
      updateOptions()
    }
    // 关系规则选择后根据规则进一步处理 labelValueOption
    if (type === 'name') {
      handleLabelValueOption()
    }
  }

  const updateOptions = () => {
    const labelName = itemInner.value.labelName
    // 如果 labelName 有值，立即重新获取 relationOption、获取labelValueOption
    if (labelName.label && labelName.labelId) {
      getRelationOption()
      getLabelValueOption()
    }
  }
  const relationOptionInner = ref<Array<IRelationOption>>([])
  const getRelationOption = () => {
    // TODO: 这里可能要改为实时调接口，不在父组件传
    console.log('标签名称选择后，根据选择结果，筛选出 relationOption')
    relationOptionInner.value = props.relationOption
  }

  // TODO: 根据关系规则，显示不同组件
  const handleLabelValueOption = () => {
    console.log(labelValueOption)
  }
  /**
   * 触发删除或增加
   * @param evt
   */
  const handleAddOrDelete = (evt: 'add' | 'delete') => {
    emit(evt, props.option)
  }

  const storeLabelNameOption = useLabelNameOption(store)
  /**
   * 远程搜索 label标签名称
   * @param query
   * @param item
   */
  const remoteMethod = (query: string, item: IFilterItem) => {
    // TODO: 这里拿到数据需要把回显的字段 填充到 label 字段，否则 ep 不会回显
    if (query) {
      item.loading = true
      setTimeout(() => {
        item.loading = false
        storeLabelNameOption.setLabelNameOption([
          {
            label: 'test1',
            labelId: '1',
          },
          {
            label: 'test2',
            labelId: '2',
          },
        ])
      }, 200)
    } else {
      storeLabelNameOption.setLabelNameOption([])
    }
  }

  const labelValueOption = ref<Array<IFilterLabelValItem>>([])
  /**
   * 获取標簽值列表
   */
  const loadingLV = ref<boolean>(false)
  const getLabelValueOption = () => {
    console.log('标签名称选择后，根据选择结果，获取labelValueOption')
    labelValueOption.value = []
    loadingLV.value = true
    setTimeout(() => {
      loadingLV.value = false
      labelValueOption.value = [
        {
          labelNameCN: '成都',
          labelId: '1',
        },
        {
          labelNameCN: '杭州',
          labelId: '2',
        },
      ]
    }, 200)
  }
</script>

<style lang="scss">
  .label-filter-form--item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    box-sizing: border-box;
    border-radius: 4px;
    &:hover {
      background-color: #e2ecfa;
    }
    .filter-col {
      height: auto;
      margin: 1rem 0;
      min-height: 100px;
      display: flex;
      flex-direction: row;
    }
    .el-select {
      margin: 0 0.5rem;
    }
    .relate-select {
      width: 130px;
    }
    .op-btn__text {
      margin: 0 0.2rem;
      cursor: pointer;
      line-height: 30px;
      font-size: 12px;
      display: flex;
      align-items: center;
      color: #606266;
      &:hover {
        color: #409eff;
      }
    }
  }
</style>
