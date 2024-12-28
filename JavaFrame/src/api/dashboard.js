import request from '@/utils/request'

export default {
  // 获取统计数据
  getStats() {
    return request({
      url: '/api/dashboard/stats',
      method: 'get'
    })
  },

  // 获取图表数据
  getChartData(params) {
    return request({
      url: '/api/dashboard/chart',
      method: 'get',
      params
    })
  },

  // 获取最近交易
  getRecentTransactions(params) {
    return request({
      url: '/api/dashboard/transactions',
      method: 'get',
      params
    })
  },

  // 获取钱包分布
  getWalletDistribution() {
    return request({
      url: '/api/dashboard/wallet-distribution',
      method: 'get'
    })
  },

  // 获取交易类型统计
  getTransactionTypes() {
    return request({
      url: '/api/dashboard/transaction-types',
      method: 'get'
    })
  }
} 