import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    avatar: localStorage.getItem('avatar') || '',
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setUserInfo(userInfo) {
      this.token = userInfo.token
      this.username = userInfo.username
      this.email = userInfo.email
      this.avatar = userInfo.avatar

      // 保存到本地存储
      localStorage.setItem('token', userInfo.token)
      localStorage.setItem('username', userInfo.username)
      localStorage.setItem('email', userInfo.email)
      localStorage.setItem('avatar', userInfo.avatar)
    },

    clearUserInfo() {
      this.token = ''
      this.username = ''
      this.email = ''
      this.avatar = ''

      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('avatar')
    },

    updateProfile(profile) {
      if (profile.username) {
        this.username = profile.username
        localStorage.setItem('username', profile.username)
      }
      if (profile.email) {
        this.email = profile.email
        localStorage.setItem('email', profile.email)
      }
      if (profile.avatar) {
        this.avatar = profile.avatar
        localStorage.setItem('avatar', profile.avatar)
      }
    }
  }
}) 