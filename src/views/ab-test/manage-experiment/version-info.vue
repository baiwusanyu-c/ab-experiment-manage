<template>
  <div class="version-info">
    <el-button v-if="isEdit !== 'true'" type="primary" icon="plus" @click="addVersionListItem"
      >添加实验版本</el-button
    >
    <div class="version-Item-container">
      <div class="version-Item version-Item--params">
        <div style="height: 160px"></div>
        <div style="width: 100%">
          <p v-if="isEdit === 'true'" class="op-btn">实验参数</p>
          <p v-show="isEdit !== 'true'" class="op-btn" @click="addVersionListParams">添加参数</p>
        </div>
        <div v-for="(paramsItem, index) in versionParamList" class="version-params">
          <div class="version-Item--title">
            <el-tooltip
              content="实验参数删除，会在提交后生效"
              placement="top"
              :disabled="index === 0">
              <el-icon color="#409eff" style="{'cursor': index !== 0 ? 'pointer' : ''}">
                <Delete
                  v-if="index !== 0 && isEdit !== 'true'"
                  @click="delVersionListParams(index)" />
              </el-icon>
            </el-tooltip>
          </div>
          <div>
            <el-input
              v-model="paramsItem.paramName"
              placeholder="参数名称"
              type="text"
              autocomplete="off"
              maxlength="50"
              @change="handleParamsChange('name')" />
            <el-select
              v-model="paramsItem.paramType"
              placeholder="请选择所属应用"
              @change="handleParamsChange('type')">
              <el-option
                v-for="item in paramsTypeList"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div v-for="(versionItem, index) in versionsForm" class="version-Item">
        <div class="version-Item--title">
          <p v-if="isEdit === 'true' && index === 0" class="op-btn" style="margin-bottom: 1rem">
            版本名称
          </p>
          <el-tooltip
            v-if="index > 1 && isEdit !== 'true'"
            content="实验版本删除，会在提交后生效"
            placement="top">
            <el-icon color="#409eff" @click="delVersionListItem(index)">
              <Delete />
            </el-icon>
          </el-tooltip>
        </div>
        <el-input
          v-model="versionItem.versionName"
          placeholder="请输入版本名称"
          type="text"
          autocomplete="off"
          maxlength="50"
          @change="handleChange" />

        <el-input
          v-model="versionItem.versionDesc"
          placeholder="请输入版本描述"
          type="textarea"
          maxlength="1000"
          rows="4"
          @change="handleChange" />
        <el-input
          v-for="(paramsItem, versionIndex) in versionItem.versionParams"
          v-model="paramsItem.paramValue"
          class="params-val"
          placeholder="请输入参数值"
          type="text"
          max="500"
          autocomplete="off"
          @input="handleInput(index, versionIndex)"
          @change="handleChange" />
      </div>
    </div>
    <span class="version-err">{{ errInfo }}</span>
  </div>
</template>

<script lang="ts" setup name="version-info">
  import { getCurrentInstance, nextTick, ref,watch } from 'vue'
  import { useEventBus } from '@vueuse/core'
  import useCommonParamsStore from '../../../store/modules/common-params'
  import store from '../../../store'
  import { debounce } from '../../../utils'
  import type { ComponentInternalInstance} from 'vue';
  import type { IComponentProxy, IOption, IVersionInfoItem , IVersionParams } from '../../../utils/types'

  const inst = getCurrentInstance() as ComponentInternalInstance
  // 默认两个版本
  const versionsForm = ref<Array<IVersionInfoItem>>([
    {
      versionName: '对照版本',
      versionDesc: '',
      versionType: 0,
      versionParams: [
        {
          paramName: '',
          paramType: 1,
          paramValue: '',
        },
      ],
    },
    {
      versionName: '实验版本',
      versionDesc: '',
      versionType: 1,
      versionParams: [
        {
          paramName: '',
          paramType: 1,
          paramValue: '',
        },
      ],
    },
  ])
  /************************ 表单校验 ****************************/

  /**
   * 校验参数
   */
  const errInfo = ref<string>('')
  const verFrom = () => {
    errInfo.value = ''
    let check = true
    const throwErr = (msg: string) => {
      errInfo.value = msg
      throw 'error'
    }
    try {
      versionsForm.value.forEach(value => {
        if (!value.versionName) {
          throwErr(`存在未填写的版本名称，请检查`)
        }
        if (value.versionParams.length === 0) {
          throwErr(`请填写版本参数`)
        }
        if (value.versionParams.length > 0) {
          value.versionParams.forEach(param => {
            if (!param.paramName) {
              throwErr(`存在未填写的参数名，请检查`)
            }
            if (!param.paramType) {
              throwErr(`存在未填写的参数类别，请检查`)
            }
            if (!param.paramValue) {
              throwErr(`存在未填写的参数值，请检查`)
            }
          })
        }
      })
      versionParamList.value.forEach(param => {
        if (!param.paramName) {
          throwErr(`存在未填写的参数名，请检查`)
        }
        if (!param.paramType) {
          throwErr(`存在未填写的参数类别，请检查`)
        }
      })
    } catch (e) {
      check = false
    }
    return check
  }

  /************************ 双向绑定相关 ****************************/

  const props = defineProps({
    modelValue: {
      type: Array<IVersionInfoItem>
    },
    isEdit: {
      type: String,
      default: '',
    },
  })
  const emit = defineEmits(['update:modelValue', 'next'])
  emit('next', true)
  const handleChange = () => {
    if (!verFrom()) {
      emit('next', true)
      return
    }
    emit('next', false)
    emit('update:modelValue', versionsForm.value)
    nextTick(() => {
      (inst!.proxy?.$parent! as IComponentProxy).cacheForm()
    })
  }
  watch(
    () => props.modelValue,
    () => {
      if (props.modelValue) {
        versionsForm.value = props.modelValue
        nextTick(() => {
          if (!verFrom()) {
            emit('next', true)
            return
          }
          emit('next', false)
        })
      }
    },
    { deep: true, immediate: true }
  )

  /**
   * 参数名称、类别填写后，触发change
   */
  const handleParamsChange = (type: string) => {
    versionParamList.value.forEach((val, index) => {
      versionsForm.value.forEach(ver => {
        ver.versionParams[index].paramName = val.paramName
        ver.versionParams[index].paramType = val.paramType
        // 类别改变时 清掉之前填写值
        if (type === 'type') {
          ver.versionParams[index].paramValue = ''
        }
      })
    })
    handleChange()
  }
  /**
   * 参数输入时校验输入内容
   * @param index
   * @param versionIndex
   */
  const handleInput = debounce((index: number, versionIndex: number) => {
    const paramType = versionsForm.value[index].versionParams[versionIndex].paramType
    const paramValue = versionsForm.value[index].versionParams[versionIndex].paramValue
    versionsForm.value[index].versionParams[versionIndex].paramValue = verOnInput(
      paramValue,
      paramType
    )
  }, 300)

  const verOnInput = (val: string, type: number) => {
    const regNum = /^(-)?[1-9][0-9]*$/g
    // 参数值匹配，允许常规字符
    const regStr = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z0-9]/im
    let res = val
    if (
      (type === 1 && !regStr.test(res)) || // string
      (type === 2 && !regNum.test(res)) || // number
      (type === 3 && res !== 'false' && res !== 'true')
    ) {
      // bool
      res = ''
    }
    return res
  }

  /************************ 版本表单相关逻辑 ****************************/

  /**
   * 添加实验版本
   */
  const addVersionListItem = () => {
    const versionItem = {
      versionName: '',
      versionDesc: '',
      versionType: 1,
      versionParams: [] as Array<IVersionParams>,
    }
    // 新添加的实验版本参数应该根据 versionParamList 填充
    versionParamList.value.forEach(val => {
      versionItem.versionParams.push({
        paramName: val.paramName,
        paramType: val.paramType,
        paramValue: '',
      })
    })
    versionsForm.value.push(JSON.parse(JSON.stringify(versionItem)))
    handleChange()
  }
  /**
   * 删除实验版本
   */
  const delVersionListItem = (index: number) => {
    ;(inst?.proxy as IComponentProxy).$modal
      .confirm(`删除操作将在提交后生效，是否要删除该实验版本？`)
      .then(() => {
        versionsForm.value.splice(index, 1)
        handleChange()
      })
      .catch((err: string) => {
        console.error(err)
      })
  }

  /************************ 参数表单相关逻辑 ****************************/

  /**
   * 添加参数
   */
  const addVersionListParams = () => {
    versionParamList.value.push({
      paramName: '',
      paramType: 1,
      paramValue: '',
    })
    // 新添加的参数应该给每个实验版本添加
    versionsForm.value.forEach(val => {
      val.versionParams.push({
        paramName: '',
        paramType: 1,
        paramValue: '',
      })
    })
    handleChange()
  }
  /**
   * 删除参数
   */
  const delVersionListParams = (index: number) => {
    ;(inst?.proxy as IComponentProxy).$modal
      .confirm(`删除操作将在提交后生效，是否要删除该实验参数？`)
      .then(() => {
        versionParamList.value.splice(index, 1)
        versionsForm.value.forEach(val => {
          val.versionParams.splice(index, 1)
        })
        handleChange()
      })
      .catch((err: string) => {
        console.error(err)
      })
  }

  /************************ 初始化版本参数表单，根据版本表单填充参数名 ****************************/

  const versionParamList = ref<Array<IOption>>([])
  const initVersionParam = () => {
    versionParamList.value = []
    versionsForm.value[0].versionParams.forEach((val: IOption) => {
      versionParamList.value.push(JSON.parse(JSON.stringify(val)))
    })
  }
  initVersionParam()

  /************************ 获取公共参数相关 ****************************/

  const bus = useEventBus<string>('commonParams')
  const paramsTypeList = ref<Array<IOption>>([])
  const setCommonParams = () => {
    paramsTypeList.value = useCommonParamsStore(store).createOption('PARAM_TYPE')
  }
  bus.on(setCommonParams)
  setCommonParams()
</script>
<style lang="scss">
  .version-err {
    font-size: 12px;
    color: #f56c6c;
    display: inline-block;
    height: 20px;
  }
  .version-Item-container {
    margin-top: 2rem;
    width: 800px;
    overflow-x: auto;
    white-space: nowrap;
    .version-Item--title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-icon {
        cursor: pointer;
        margin-bottom: 1rem;
      }
    }
    .version-Item {
      display: inline-block;
      width: 14rem;
      padding: 0.5rem;
      .el-input,
      .el-textarea {
        margin-bottom: 1rem;
        display: block;
      }
    }
    .params-val {
      height: 5rem;
      .el-input__inner {
        height: 5rem;
      }
    }
    .version-Item--params {
      position: relative;
      bottom: 0;
      .op-btn {
        text-align: right;
      }
    }
    .version-params {
      height: 5rem;
      margin-top: 1rem;
      display: flex;
      .el-icon {
        margin: 1rem;
      }
      .el-input,
      .el-select {
        margin-bottom: 1rem;
        display: block;
        width: 100%;
      }
    }
  }
</style>
