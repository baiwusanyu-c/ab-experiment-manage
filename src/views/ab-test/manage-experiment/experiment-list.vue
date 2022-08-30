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
            @click="publishExp(scope.row.experimentId)"
            >发布</span
          >
          <span
            v-if="scope.row.experimentStatus === '2' || scope.row.experimentStatus === '3'"
            v-hasPermi="['system:role:edit']"
            class="op-btn"
            @click="cancelExp(scope.row.experimentId)"
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
  // TODO: 搜索字段对接    complete
  // TODO: 实验列表字段对接 complete
  // TODO: 实验新增接口对接
  // TODO: 实验新增逻辑编写
  // TODO: 实验编辑接口对接
  // TODO: 实验编辑逻辑编写
  // TODO: 实验发布接口对接 complete
  // TODO: 实验发布逻辑编写 complete
  // TODO: 实验取消接口对接 complete
  // TODO: 实验取消逻辑编写 complete
  // TODO: 实验详情接口对接
  // TODO: 实验详情逻辑编写
  import { computed, getCurrentInstance, nextTick, ref } from 'vue'
  import { useEventBus } from '@vueuse/core'
  import { useRouter } from 'vue-router'
  import { cancelExperiment, listExperiment, publishExperiment } from '../../../api/ab-test/ab-test'
  import useCommonParamsStore from '../../../store/modules/common-params'
  import { parseTime, toPrecision } from '../../../utils/ruoyi'
  import store from '../../../store'
  import type { IExpStatus, IExpType } from '../../../store/modules/common-params'
  import type { ComponentPublicInstance } from 'vue'
  import type { IComponentProxy, IExpData, IExpQueryParams, IOption } from '../../../utils/types'
  interface IAppAddEdit extends ComponentPublicInstance {
    appAddEdit: {
      resetForm: Function
    }
  }
  const inst = getCurrentInstance()
  /********************* 搜索相关逻辑 *******************************/

  const showSearch = ref<boolean>(true)
  const queryParams = ref<IExpQueryParams>({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    status: 1,
    startTime: '',
    endTime: '',
    dateArr: [],
  })

  const handleQuery = () => {
    if (queryParams.value.dateArr?.length > 0) {
      queryParams.value.startTime = parseTime(queryParams.value.dateArr[0].toDateString())
      queryParams.value.endTime = parseTime(queryParams.value.dateArr[1].toDateString())
    }
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
    router.push(`experiment-edit?expId=${row.experimentId}`)
  }

  /**
   * 取消实验
   */
  const cancelExp = (experimentId: number) => {
    ;(inst?.proxy as IComponentProxy).$modal
      .confirm(`是否取消该实验？`)
      .then(() => {
        return cancelExperiment({ experimentId })
      })
      .then(() => {
        getList()
        ;(inst?.proxy as IComponentProxy).$modal.msgSuccess('取消成功')
      })
      .catch(err => {
        console.error(err)
      })
  }
  /**
   * 发布实验
   */
  const publishExp = (experimentId: number) => {
    ;(inst?.proxy as IComponentProxy).$modal
      .confirm(`是否发布该实验？`)
      .then(() => {
        return publishExperiment({ experimentId })
      })
      .then(() => {
        getList()
        ;(inst?.proxy as IComponentProxy).$modal.msgSuccess('发布成功')
      })
      .catch(err => {
        console.error(err)
      })
  }
  /************************ 获取公共参数相关 ****************************/
  const expStatus = ref<IExpStatus>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  })

  const expType = ref<IExpType>({
    1: '',
    2: '',
  })
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
  const expList = ref<Array<IExpData>>([
    {
      experimentId: '1',
      experimentName: '示例实验1998',
      appName: '实例应用微信小程序',
      experimentType: 1,
      experimentStatus: 2,
      startTime: '2022-8-10 10:10:00',
      endTime: '2077-11-10 10:10:00',
      experimentTrafficWeight: 0.5666,
      createTime: '2022-8-10 10:10:00',
    },
  ])
  const loading = ref<boolean>(false)
  const getList = () => {
    loading.value = true
    const params = {
      ...queryParams.value,
    }
    Reflect.deleteProperty(params, 'dateArr')
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
