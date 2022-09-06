<template>
  <div class="report-quota">
    <h3>
      <el-icon color="#409EFF" size="30px"><Histogram /></el-icon>
      实验指标
    </h3>
    <div class="filter">
      指标：
      <el-select v-model="queryParams" placeholder="请选择应用类型" @change="handleSelect">
        <el-option
          v-for="item in quotaSelectList"
          :key="item.indicatorsNameCN + item.indicatorsName"
          :label="item.indicatorsNameCN"
          :value="item.indicatorsName"></el-option>
      </el-select>
    </div>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="实验分组" prop="versionName">
        <template #default="scope">
          <div class="table-version-name">
            <p class="ver-name">{{ scope.row.versionName }}</p>
            <p class="ver-id">
              版本ID: {{ scope.row.versionId }}
              <el-icon v-copyText="scope.row.versionId" v-copyText:callback="copyTextSuccess"
                ><CopyDocument />
              </el-icon>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="进组人数" prop="totalPerson" align="center">
        <template #default="scope">
          <p>
            <span class="total-person">{{ computeValToComma(scope.row.totalPerson) }}</span>
            {{ computeGroupProportion(scope.row.totalPerson, total) }}%
          </p>
        </template>
      </el-table-column>
      <el-table-column :label="computeHeaderName" prop="indicatorValue" align="center">
        <template #default="scope">
          <span>{{ scope.row.indicatorValue }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="差异绝对值"
        align="center"
        prop="differenceAbsoluteValue"
        :formatter="handleEmpty">
      </el-table-column>
      <el-table-column
        label="差异相对值"
        align="center"
        prop="differenceRelativeValue"
        :formatter="handleEmpty">
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup name="ReportQuota">
  import { computed, getCurrentInstance, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { indicatorsList, indicatorsReport } from '../../../../api/ab-test/ab-test'
  import { numDivision, numberToCommaString } from '../../../../utils/ruoyi'
  import type { IComponentProxy, IOption } from '../../../../utils/types'

  const quotaSelectList = ref<IOption>([])
  const getQuotaSelectList = () => {
    indicatorsList({ experimentId: expId }).then(res => {
      quotaSelectList.value = res.data
      queryParams.value = res.data[0].indicatorsName
      headerName.value = res.data[0].indicatorsNameCN
      emit('select',queryParams.value)
      getList()
    })
  }

  const queryParams = ref<string>('')
  const loading = ref<boolean>(false)
  const total = ref<number>(1)
  const list = ref([])
  const getList = async () => {
    loading.value = true
    const params = {
      experimentId: expId,
      indicatorsName: queryParams.value,
    }
    indicatorsReport(params)
      .then(res => {
        list.value = res.data.versions
        total.value = res.data.total
      })
      .finally(() => {
        loading.value = false
      })
  }

  const computeValToComma = computed(() => {
    return function (val: number) {
      return numberToCommaString(val, 3)
    }
  })
  const computeGroupProportion = computed(() => {
    return function (val: number, total: number) {
      return (numDivision(val, total) * 100).toFixed(3)
    }
  })

  const route = useRoute()
  let expId = ''
  const init = () => {
    if (route.query.expId) {
      expId = route.query.expId as string
      getQuotaSelectList()
    }
  }
  init()

  const inst = getCurrentInstance()
  function copyTextSuccess() {
    ;(inst.proxy as IComponentProxy).$modal.msgSuccess('复制成功')
  }

  const handleEmpty = (row, column, cellValue) => {
    if (cellValue === 'null' || !cellValue) {
      return '—'
    }
    return cellValue
  }

  const headerName = ref<string>('')
  const computeHeaderName = computed(() => {
    return headerName.value
  })
  const emit = defineEmits(['select'])
  const handleSelect = (data: string) => {
    try {
      quotaSelectList.value.forEach(val => {
        if (val.indicatorsName === data) {
          headerName.value = val.indicatorsNameCN
          throw 'error'
        }
      })
    } catch (e) {}
    emit('select',queryParams.value)
    getList()
  }
</script>

<style scoped lang="scss">
  .report-quota {
    margin-top: 2rem;
    border-radius: 0.1rem;
    border: 1px solid #e5e6e7;
    box-sizing: border-box;
    padding: 1rem 1.5rem;
    h3{
      display: flex;
      align-items: center;
      .el-icon{
        margin-right: .5rem;
      }
    }
    .filter {
      margin-bottom: 2rem;
    }
    .table-version-name {
      .ver-name {
        margin: 0;
        color: #304156;
        font-weight: bolder;
      }
      .ver-id {
        margin: 0;
        .el-icon {
          cursor: pointer;
        }
      }
    }
    .total-person {
      color: #409eff;
      font-weight: bolder;
      margin-right: 0.5rem;
    }
  }
</style>
