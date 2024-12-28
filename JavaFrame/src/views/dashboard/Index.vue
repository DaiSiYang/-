<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card 
        v-for="(stat, index) in stats" 
        :key="index"
        class="stats-card" 
        shadow="hover"
        @click="handleCardClick(stat)"
      >
        <div class="stats-content">
          <div class="stats-icon">
            <el-icon :size="24">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value">{{ stat.value }}</div>
            <div class="stats-label">{{ stat.label }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 交易历史图表 -->
      <el-card class="chart-card" v-loading="loading.chart">
        <template #header>
          <div class="card-header">
            <span>交易历史</span>
            <el-radio-group v-model="chartTimeRange" size="small">
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div class="chart-container">
          <v-chart class="chart" :option="chartOption" autoresize />
        </div>
      </el-card>

      <!-- 钱包资产分布 -->
      <el-card class="chart-card" v-loading="loading.walletDistribution">
        <template #header>
          <div class="card-header">
            <span>钱包资产分布</span>
          </div>
        </template>
        <div class="chart-container">
          <v-chart class="chart" :option="walletDistributionOption" autoresize />
        </div>
      </el-card>

      <!-- 交易类型统计 -->
      <el-card class="chart-card" v-loading="loading.transactionTypes">
        <template #header>
          <div class="card-header">
            <span>交易类型统计</span>
          </div>
        </template>
        <div class="chart-container">
          <v-chart class="chart" :option="transactionTypesOption" autoresize />
        </div>
      </el-card>

      <!-- 最近交易列表 -->
      <el-card class="transactions-card">
        <template #header>
          <div class="card-header">
            <span>最近交易</span>
            <div class="header-actions">
              <el-button type="primary" link @click="drawer = true">
                <el-icon><Filter /></el-icon>
                筛选
              </el-button>
              <el-button type="primary" link @click="exportTransactions" :loading="loading.export">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
              <el-button type="primary" link @click="viewAllTransactions">
                查看全部
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </template>

        <el-table :data="recentTransactions" v-loading="loading.transactions">
          <el-table-column label="时间" width="160">
            <template #default="{ row }">
              {{ formatDate(row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="row.type === 'receive' ? 'success' : 'warning'" size="small">
                {{ row.type === 'receive' ? '收款' : '转账' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="金额" width="150">
            <template #default="{ row }">
              <span :class="row.type === 'receive' ? 'amount-receive' : 'amount-send'">
                {{ row.type === 'receive' ? '+' : '-' }} {{ formatNumber(row.amount) }} ETH
              </span>
            </template>
          </el-table-column>
          <el-table-column label="地址" show-overflow-tooltip>
            <template #default="{ row }">
              <el-link type="primary" @click="copyAddress(row.address)">
                {{ formatAddress(row.address) }}
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 筛选抽屉 -->
    <el-drawer
      v-model="drawer"
      title="交易筛选"
      direction="rtl"
      size="400px"
    >
      <el-form :model="filterForm" label-width="80px">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="filterForm.type" placeholder="请选择" style="width: 100%">
            <el-option label="全部" value="" />
            <el-option label="转账" value="send" />
            <el-option label="收款" value="receive" />
            <el-option label="兑换" value="exchange" />
            <el-option label="质押" value="stake" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额范围">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-input
                v-model="filterForm.minAmount"
                placeholder="最小金额"
                type="number"
              >
                <template #append>ETH</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="filterForm.maxAmount"
                placeholder="最大金额"
                type="number"
              >
                <template #append>ETH</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="drawer-footer">
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="primary" @click="handleFilter">应用筛选</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import { 
  GridComponent, 
  TooltipComponent, 
  LegendComponent,
  ToolboxComponent 
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import {
  Refresh,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Download,
  Filter,
  Money,
  WalletFilled,
  Top,
  Bottom
} from '@element-plus/icons-vue'
import dashboardApi from '@/api/dashboard'

// 注册 ECharts 组件
echarts.use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent
])

const router = useRouter()
const drawer = ref(false)
const loading = ref({
  stats: false,
  chart: false,
  transactions: false,
  walletDistribution: false,
  transactionTypes: false,
  export: false
})

// 统计数据
const stats = ref([
  {
    label: '钱包数量',
    value: '0',
    icon: WalletFilled,
    iconClass: 'wallet-icon',
    route: '/wallet'
  },
  {
    label: '总资产',
    value: '0.00 ETH',
    icon: Money,
    iconClass: 'balance-icon'
  },
  {
    label: '今日收入',
    value: '+0.00 ETH',
    icon: Top,
    iconClass: 'income-icon'
  },
  {
    label: '今日支出',
    value: '-0.00 ETH',
    icon: Bottom,
    iconClass: 'expense-icon'
  }
])

// 图表相关
const chartTimeRange = ref('week')
const chartData = ref([])
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      const [param] = params
      return `${param.name}<br/>${param.value} ETH`
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: chartData.value.map(item => item.date)
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: value => `${value} ETH`
    }
  },
  series: [{
    name: '资产总值',
    type: 'line',
    smooth: true,
    data: chartData.value.map(item => item.value),
    areaStyle: {
      opacity: 0.1
    },
    lineStyle: {
      width: 3
    },
    itemStyle: {
      color: '#667eea'
    }
  }]
}))

// 最近交易
const recentTransactions = ref([])

// 新增状态
const walletDistribution = ref([])
const transactionTypes = ref([])
const filterForm = ref({
  dateRange: [],
  type: '',
  minAmount: '',
  maxAmount: ''
})

// 钱包分布饼图配置
const walletDistributionOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ETH ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center'
  },
  series: [{
    name: '钱包资产',
    type: 'pie',
    radius: ['50%', '70%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 2
    },
    label: {
      show: false
    },
    emphasis: {
      label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    data: walletDistribution.value
  }]
}))

// 交易类型统计图配置
const transactionTypesOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: transactionTypes.value.map(item => item.name)
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '交易数量',
    type: 'bar',
    data: transactionTypes.value.map(item => ({
      value: item.value,
      itemStyle: {
        color: item.color
      }
    })),
    barWidth: '60%',
    itemStyle: {
      borderRadius: [8, 8, 0, 0]
    }
  }]
}))

// 模拟获取数据
const fetchStats = async () => {
  loading.value.stats = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新统计卡片数据
    stats.value[0].value = '5'
    stats.value[1].value = '1234.56 ETH'
    stats.value[2].value = '+2.5 ETH'
    stats.value[3].value = '-1.2 ETH'
    
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value.stats = false
  }
}

const fetchChartData = async () => {
  loading.value.chart = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 生成模拟数据
    const days = chartTimeRange.value === 'week' ? 7 : chartTimeRange.value === 'month' ? 30 : 365
    chartData.value = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString(),
      value: (1000 + Math.random() * 500).toFixed(2)
    }))
  } catch (error) {
    ElMessage.error('获取图表数据失败')
  } finally {
    loading.value.chart = false
  }
}

const fetchTransactions = async () => {
  loading.value.transactions = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    recentTransactions.value = [
      {
        timestamp: Date.now(),
        type: 'receive',
        amount: 0.5,
        address: '0x1234567890abcdef1234567890abcdef12345678'
      },
      {
        timestamp: Date.now() - 3600000,
        type: 'send',
        amount: 0.1,
        address: '0xabcdef1234567890abcdef1234567890abcdef12'
      }
      // 可以添加更多模拟数据
    ]
  } catch (error) {
    ElMessage.error('获取交易记录失败')
  } finally {
    loading.value.transactions = false
  }
}

// 获取钱包分布数据
const fetchWalletDistribution = async () => {
  loading.value.walletDistribution = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    walletDistribution.value = [
      { value: 500, name: '主钱包', itemStyle: { color: '#667eea' } },
      { value: 300, name: '投资钱包', itemStyle: { color: '#764ba2' } },
      { value: 200, name: '交易钱包', itemStyle: { color: '#10b981' } },
      { value: 100, name: '储蓄钱包', itemStyle: { color: '#f59e0b' } }
    ]
  } catch (error) {
    ElMessage.error('获取钱包分布数据失败')
  } finally {
    loading.value.walletDistribution = false
  }
}

// 获取交易类型统计
const fetchTransactionTypes = async () => {
  loading.value.transactionTypes = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    transactionTypes.value = [
      { name: '转账', value: 45, color: '#ef4444' },
      { name: '收款', value: 32, color: '#10b981' },
      { name: '兑换', value: 18, color: '#f59e0b' },
      { name: '质押', value: 5, color: '#667eea' }
    ]
  } catch (error) {
    ElMessage.error('获取交易类型统计失败')
  } finally {
    loading.value.transactionTypes = false
  }
}

// 导出交易记录
const exportTransactions = async () => {
  try {
    loading.value.export = true
    // 模拟出过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 实际项目中这里应该调用后端API获取导出文件
    const data = recentTransactions.value.map(tx => ({
      时间: formatDate(tx.timestamp),
      类型: tx.type === 'receive' ? '收款' : '转账',
      金额: `${tx.amount} ETH`,
      地址: tx.address
    }))
    
    // 创建CSV内容
    const headers = ['时间', '类型', '金额', '地址']
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n')
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    loading.value.export = false
  }
}

// 处理筛选
const handleFilter = () => {
  fetchTransactions()
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    dateRange: [],
    type: '',
    minAmount: '',
    maxAmount: ''
  }
  fetchTransactions()
}

// 自动刷新定时器
let refreshTimer = null

// 工具函数
const formatNumber = (num) => {
  return Number(num).toFixed(2)
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const formatAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const copyAddress = async (address) => {
  try {
    await navigator.clipboard.writeText(address)
    ElMessage.success('地址已复制')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const refreshStats = () => {
  fetchStats()
}

const viewAllTransactions = () => {
  router.push('/transactions')
}

// 处理卡片点击
const handleCardClick = (stat) => {
  console.log('Card clicked:', stat)
  if (stat.route) {
    console.log('Navigating to:', stat.route)
    try {
      router.push(stat.route)
    } catch (err) {
      console.error('Navigation failed:', err)
      ElMessage.error('导航失败，请稍后重试')
    }
  }
}

const goToWalletList = () => {
  console.log('Navigating to wallet list') // 添加调试日志
  router.push({ name: 'WalletList' })
}

// 生命周期钩子
onMounted(() => {
  fetchStats()
  fetchChartData()
  fetchTransactions()
  fetchWalletDistribution()
  fetchTransactionTypes()
  
  // 设置自动刷新
  refreshTimer = setInterval(() => {
    fetchStats()
  }, 30000) // 每30秒刷新一次
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})

// 监听图表时间范围变化
watch(chartTimeRange, () => {
  fetchChartData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stats-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stats-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: white;
  flex-shrink: 0;
}

.stats-info {
  flex: 1;
  min-width: 0;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats-label {
  font-size: 14px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.chart-container {
  height: 300px;
  padding: 16px;
}

.transactions-card {
  grid-column: span 2;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.amount-receive {
  color: #10b981;
  font-weight: 500;
}

.amount-send {
  color: #ef4444;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .transactions-card {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 