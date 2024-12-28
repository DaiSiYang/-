import { defineStore } from 'pinia'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallets: JSON.parse(localStorage.getItem('wallets') || '[]')
  }),

  getters: {
    getWalletById: (state) => (id) => {
      return state.wallets.find(wallet => wallet.id === id)
    }
  },

  actions: {
    createWallet(walletData) {
      const newWallet = {
        id: Date.now().toString(),
        address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        balance: '0.00',
        ...walletData,
        createdAt: new Date().toISOString()
      }
      
      this.wallets.push(newWallet)
      this.saveWallets()
      
      return newWallet
    },

    updateWallet(id, data) {
      const index = this.wallets.findIndex(w => w.id === id)
      if (index !== -1) {
        this.wallets[index] = { ...this.wallets[index], ...data }
        this.saveWallets()
      }
    },

    deleteWallet(id) {
      const index = this.wallets.findIndex(w => w.id === id)
      if (index !== -1) {
        this.wallets.splice(index, 1)
        this.saveWallets()
      }
    },

    saveWallets() {
      localStorage.setItem('wallets', JSON.stringify(this.wallets))
    }
  }
}) 