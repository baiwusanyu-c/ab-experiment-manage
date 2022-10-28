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
      class="label-name-select"
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
      v-if="showTypes === 'select'"
      v-model="itemInner.labelValue"
      :disabled="!!!itemInner.relateId"
      multiple
      filterable
      placeholder="请选择标签值"
      :remote-method="query => getLabelValueOption(query, itemInner)"
      :loading="itemInner.loading"
      @change="handleChange('value')">
      <el-option
        v-for="labelItem in labelValueOption"
        :label="labelItem.labelNameCN"
        :value="labelItem.labelNameCN" />
    </el-select>

    <el-input
      v-if="showTypes === 'input'"
      v-model="itemInner.labelValue[0]"
      :disabled="!!!itemInner.relateId"
      class="label-value-input"
      placeholder="请输入值"
      @input="handleChange('value')" />

    <el-input
      v-if="showTypes === 'day'"
      v-model.number="relativeTime"
      :disabled="!!!itemInner.relateId"
      class="label-value-input__day"
      placeholder="请输入值"
      @input="handleChange('value')" />
    <span v-if="showTypes === 'day'">天</span>
    <el-select
      v-if="showTypes === 'day'"
      v-model="relativeTimeType"
      :disabled="!!!itemInner.relateId"
      class="relate-select label-value-select__day"
      @change="handleChange('value')">
      <el-option label="之前" :value="0" />
      <el-option label="之内" :value="1" />
    </el-select>

    <el-date-picker
      v-if="showTypes === 'timeRange'"
      v-model="itemInner.labelValue"
      type="datetimerange"
      :disabled="!!!itemInner.relateId"
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
      @change="handleChange('value')" />

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
  import { getLabelFunction, getLabelList, getLabelValue } from '../../../api/ab-test/ab-test'
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
          handleLabelValueOption()
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
    // 标签名称选择后，根据选择结果，筛选出 relationOption、获取 labelValueOption
    if (type === 'name') {
      updateOptions()
    }
    // 关系规则选择后根据规则进一步处理 labelValueOption
    if (type === 'function') {
      handleLabelValueOption()
    }
    // 标签值选择后。需要根据类型处理数据
    if (type === 'value') {
      handleLabelValue()
    }

    emit('update:modelValue', itemInner.value)
  }

  const updateOptions = () => {
    const labelName = itemInner.value.labelName
    // 如果 labelName 有值，立即重新获取 relationOption、获取labelValueOption
    if (labelName.label && labelName.labelId) {
      getRelationOption()
      getLabelValueOption()
    }
  }

  const showTypes = ref<string>('select')
  /**
   * 根据关系规则，显示不同组件
   */
  const handleLabelValueOption = () => {
    let nShowType = ''
    if (/absolute/.test(itemInner.value.relateId)) {
      // 绝对时间 -》 时间选择器
      nShowType = 'timeRange'
    } else if (/relative/.test(itemInner.value.relateId)) {
      // 相对时间 -》 输入框 xx天/ 选择器 之内、之前（之内是当前时间向未来加x天，之后反之）
      nShowType = 'day'
    } else if (/than/.test(itemInner.value.relateId)) {
      // 大小于 -》 输入框
      nShowType = 'input'
    } else if (
      /valuable/.test(itemInner.value.relateId) ||
      /false/.test(itemInner.value.relateId) ||
      /true/.test(itemInner.value.relateId)
    ) {
      // 真假、有值无值 -》 不显示
      nShowType = 'none'
    } else {
      nShowType = 'select'
    }
    if (nShowType !== showTypes.value) {
      itemInner.value.labelValue = []
      showTypes.value = nShowType
    }
  }
  const relativeTime = ref<string>('')
  const relativeTimeType = ref<number>(0)
  const handleLabelValue = () => {
    if (showTypes.value === 'day') {
      itemInner.value.labelValue = []
      if (relativeTimeType.value === 1) {
        itemInner.value.labelValue = [`${relativeTime.value}`]
      } else {
        itemInner.value.labelValue = [`-${relativeTime.value}`]
      }
    }

    if (showTypes.value === 'timeRange') {
      // TODO:.....?
      console.log('timeRange')
    }

    console.log(itemInner.value.labelValue)
  }
  /**
   * 触发删除或增加
   * @param evt
   */
  const handleAddOrDelete = (evt: 'add' | 'delete') => {
    emit(evt, props.option)
  }

  /******************************************* option 列表数据获取 ******************************************/

  const relationOptionInner = ref<Array<IRelationOption>>([])
  const getRelationOption = () => {
    const labelType = itemInner.value.labelName.labelType!
    if (!labelType) return
    relationOptionInner.value = []
    loadingLV.value = true
    getLabelFunction({ labelType: labelType.toLowerCase() })
      .then((res: any) => {
        if (res) {
          relationOptionInner.value = res.data
        }
      })
      .finally(() => {
        loadingLV.value = false
      })
  }

  const storeLabelNameOption = useLabelNameOption(store)
  /**
   * 远程搜索 label标签名称
   * @param query
   * @param item
   */
  const remoteMethod = (query: string, item: IFilterItem) => {
    // 这里拿到数据需要把回显的字段 填充到 label 字段，否则 ep 不会回显
    if (query) {
      item.loading = true
      getLabelList({ labelNameCN: query })
        .then((res: any) => {
          res.data.forEach((val: any) => {
            val.label = val.labelName
          })
          if (res) {
            storeLabelNameOption.setLabelNameOption(res.data)
          }
        })
        .finally(() => {
          item.loading = false
        })
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
    const labelId = itemInner.value.labelName.labelId!
    if (!labelId) return
    labelValueOption.value = []
    loadingLV.value = true
    getLabelValue({ labelId })
      .then((res: any) => {
        if (res) {
          labelValueOption.value = res.data
        }
      })
      .finally(() => {
        loadingLV.value = false
      })
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
    .label-value-input {
      width: 13.3rem;
      margin: 0 0.5rem;
    }
    .label-value-input__day {
      width: 8rem;
      margin: 0 0.5rem;
    }
    .label-value-select__day {
      width: 80px;
    }
    .label-name-select {
      width: 10rem;
    }
  }
</style>
