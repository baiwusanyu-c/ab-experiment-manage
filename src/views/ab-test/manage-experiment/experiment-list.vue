<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
      <el-form-item label="实验名称" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入实验名称"
          clearable
          maxlength="50"
          style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="实验状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择应用类型">
          <el-option label="全部" :value="0"></el-option>
          <el-option
            v-for="item in expStatusList"
            :key="item.label + item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运行时间" prop="dateArr">
        <el-date-picker
          v-model="queryParams.dateArr"
          type="datetimerange"
          range-separator="To"
          start-placeholder="开始时间"
          end-placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:role:add']"
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @query-table="getList"></right-toolbar>
    </el-row>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="expList">
      <el-table-column type="index" width="50" />
      <el-table-column label="实验名称" prop="experimentName" show-overflow-tooltip />
      <el-table-column label="所属应用" prop="appName" show-overflow-tooltip />
      <el-table-column label="实验类型" prop="experimentType" width="100">
        <template #default="scope">
          <span>{{ getOptionVal(expType, scope.row.experimentType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实验状态" prop="experimentStatus" width="100">
        <template #default="scope">
          <span>{{ getOptionVal(expStatus, scope.row.experimentStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流量分配" prop="experimentTrafficWeight" width="100">
        <template #default="scope">
          <span>{{ toPrecision(scope.row.experimentTrafficWeight * 10, 2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <span
            v-if="scope.row.experimentStatus === '1'"
            v-hasPermi="['system:role:edit']"
            class="op-btn"
            @click="publishAndCancelExp(scope.row.experimentId, 0)"
            >发布</span
          >
          <span
            v-if="scope.row.experimentStatus === '2' || scope.row.experimentStatus === '3'"
            v-hasPermi="['system:role:edit']"
            class="op-btn"
            @click="publishAndCancelExp(scope.row.experimentId, 1)"
            >取消</span
          >
          <span
            v-if="
              scope.row.experimentStatus === '1' ||
              scope.row.experimentStatus === '2' ||
              scope.row.experimentStatus === '3'
            "
            v-hasPermi="['system:role:edit']"
            class="op-btn"
            @click="handleEdit(scope.row)"
            >编辑</span
          >
          <span
            v-if="
              scope.row.experimentStatus === '3' ||
              scope.row.experimentStatus === '4' ||
              scope.row.experimentStatus === '5'
            "
            v-hasPermi="['system:role:edit']"
            class="op-btn"
            @click="handleEdit(scope.row)"
            >查看报告</span
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList" />
  </div>
</template>

<script lang="ts" name="experiment-list" setup>
  import { computed, getCurrentInstance, ref } from 'vue'
  import { useEventBus } from '@vueuse/core'
  import { useRouter } from 'vue-router'
  import { cancelExperiment, listExperiment, publishExperiment } from '../../../api/ab-test/ab-test'
  import useCommonParamsStore from '../../../store/modules/common-params'
  import { parseTime, toPrecision } from '../../../utils/ruoyi'
  import store from '../../../store'
  import { useAbtest } from '../../../hook/use-abtest'
  import type { IExpStatus, IExpType } from '../../../store/modules/common-params'
  import type { IComponentProxy, IExpData, IExpQueryParams, IOption } from '../../../utils/types'
  const inst = getCurrentInstance()
  /********************* 搜索相关逻辑 *******************************/

  const showSearch = ref<boolean>(true)
  const queryParams = ref<IExpQueryParams>({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    status: 0,
    startTime: '',
    endTime: '',
    dateArr: [],
  })

  const { handleDateArr } = useAbtest()
  const handleQuery = () => {
    queryParams.value = handleDateArr(queryParams.value)
    queryParams.value.pageNum = 1
    getList()
  }

  const resetQuery = () => {
    ;(inst?.proxy as IComponentProxy).resetForm('queryRef')
    handleQuery()
  }
  /********************* 新增、编辑、取消、发布相关逻辑 *******************************/

  const router = useRouter()
  const handleAdd = () => {
    router.push('experiment-add')
  }

  const handleEdit = (row: IExpData) => {
    router.push(`experiment-edit?expId=${row.experimentId}&isEdit=true`)
  }
  /**
   * 发布、取消实验
   */
  const publishAndCancelExp = (experimentId: number, type: number) => {
    ;(inst?.proxy as IComponentProxy).$modal
      .confirm(`是否${type === 1 ? '取消' : '发布'}该实验？`)
      .then(() => {
        if (type === 1) {
          return cancelExperiment({ experimentId })
        }
        return publishExperiment({ experimentId })
      })
      .then(() => {
        getList()
        ;(inst?.proxy as IComponentProxy).$modal.msgSuccess(`${type === 1 ? '取消' : '发布'}成功`)
      })
      .catch(err => {
        console.error(err)
      })
  }
  /************************ 获取公共参数相关 ****************************/
  const expStatus = ref<IExpStatus>({})
  const expType = ref<IExpType>({})
  const expStatusList = ref<Array<IOption>>([])
  const bus = useEventBus<string>('commonParams')
  const setCommonParams = () => {
    expType.value = useCommonParamsStore(store).getParams('EXPERIMENT_TYPE')
    expStatus.value = useCommonParamsStore(store).getParams('EXPERIMENT_STATUS')
    expStatusList.value = useCommonParamsStore(store).createOption('EXPERIMENT_STATUS')
  }
  bus.on(setCommonParams)
  setCommonParams()

  const getOptionVal = computed(() => {
    return function (data, key) {
      if (key && data) {
        return data[key]
      }
      return ''
    }
  })

  /************************ 获取列表相关 ****************************/
  const total = ref<number>(0)
  const expList = ref<Array<IExpData>>([])
  const loading = ref<boolean>(false)
  const getList = () => {
    loading.value = true
    const params = {
      ...queryParams.value,
    }
    listExperiment(params)
      .then((res: any) => {
        if (res) {
          expList.value = res.rows
          total.value = res.total
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
  getList()
</script>
