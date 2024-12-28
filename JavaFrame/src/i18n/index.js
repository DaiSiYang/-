import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    layout: {
      title: '区块链钱包管理系统',
      dashboard: '仪表盘',
      walletList: '我的钱包',
      createWallet: '创建钱包',
      transactions: '交易记录',
      logout: '退出登录'
    }
  },
  en: {
    layout: {
      title: 'Blockchain Wallet Management',
      dashboard: 'Dashboard',
      walletList: 'My Wallets',
      createWallet: 'Create Wallet',
      transactions: 'Transactions',
      logout: 'Logout'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'zh',
  fallbackLocale: 'zh',
  messages
})

export default i18n 