import request from '@/utils/request'

export default {
  // 获取钱包列表
  getList() {
    return request({
      url: '/wallet',
      method: 'get'
    })
  },

  // 创建钱包
  create(data) {
    return request({
      url: '/wallet',
      method: 'post',
      data
    })
  }
} 