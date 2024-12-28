<template>
  <div class="transactions-container">
    <el-card class="transactions-card">
      <template #header>
        <div class="card-header">
          <h3>交易记录</h3>
          <el-button type="primary" @click="refreshTransactions">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      
      <el-table
        :data="transactions"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="date" label="时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.date) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'receive' ? 'success' : 'warning'">
              {{ row.type === 'receive' ? '收款' : '转账' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="amount" label="金额" width="150">
          <template #default="{ row }">
            <span :class="row.type === 'receive' ? 'amount-plus' : 'amount-minus'">
              {{ row.type === 'receive' ? '+' : '-' }} {{ row.amount }} ETH
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="from" label="发送方" />
        <el-table-column prop="to" label="接收方" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟交易数据
const transactions = ref([
  {
    date: new Date(),
    type: 'receive',
    amount: '0.5',
    from: '0x1234...5678',
    to: '0x8765...4321',
    status: 'success'
  },
  {
    date: new Date(Date.now() - 86400000),
    type: 'send',
    amount: '0.1',
    from: '0x8765...4321',
    to: '0x2468...1357',
    status: 'pending'
  }
])

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const getStatusType = (status) => {
  const types = {
    success: 'success',
    pending: 'warning',
    failed: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    success: '成功',
    pending: '处理中',
    failed: '失败'
  }
  return texts[status] || status
}

const refreshTransactions = async () => {
  loading.value = true
  try {
    // TODO: 调用获取交易记录API
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('刷新成功')
  } catch (error) {
    console.error('刷新失败:', error)
    ElMessage.error('刷新失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  refreshTransactions()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  refreshTransactions()
}
</script>

<style scoped>
.transactions-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
  font-weight: 600;
}

/* 表格样式优化 */
:deep(.el-table) {
  --el-table-header-text-color: #1a1a1a !important;
  --el-table-text-color: #374151 !important;
  background: transparent !important;
}

:deep(.el-table th) {
  background: rgba(99, 102, 241, 0.1) !important;
  border-bottom: 2px solid rgba(99, 102, 241, 0.2);
  font-weight: 600;
}

:deep(.el-table td) {
  background: rgba(255, 255, 255, 0.6) !important;
}

:deep(.el-table tr) {
  transition: all 0.3s;
}

:deep(.el-table tr:hover td) {
  background: rgba(255, 255, 255, 0.8) !important;
}

/* 金额样式 */
.amount-plus {
  color: #059669;
  font-weight: 600;
  text-shadow: 0 0 1px rgba(5, 150, 105, 0.2);
}

.amount-minus {
  color: #dc2626;
  font-weight: 600;
  text-shadow: 0 0 1px rgba(220, 38, 38, 0.2);
}

/* 标签样式优化 */
:deep(.el-tag) {
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
}

:deep(.el-tag--success) {
  color: #fff !important;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
}

:deep(.el-tag--warning) {
  color: #fff !important;
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%) !important;
}

:deep(.el-tag--danger) {
  color: #fff !important;
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%) !important;
}

/* 分页样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-pagination) {
  --el-pagination-hover-color: #6366f1;
  --el-pagination-button-color: #374151;
  --el-pagination-text-color: #374151;
  font-weight: 500;
}

:deep(.el-pagination .el-select .el-input .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.8);
}

/* 地址文本样式 */
:deep(.el-table .cell) {
  font-family: 'Roboto Mono', monospace;
}

/* 表格行交替颜色 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: rgba(255, 255, 255, 0.4) !important;
}

/* 加载状态背景 */
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
}
</style> 