// stores/auth.ts
// 认证 / token / userInfo

import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import { post, get } from '@/api/http'

const TOKEN_KEY = 'token'
const USER_KEY = 'userInfo'

export interface UserInfo {
  id?: string | number
  username?: string
  name?: string
  avatar?: string
  role?: string
  [key: string]: any
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: storage.get<string>(TOKEN_KEY, '') as string,
    userInfo: storage.get<UserInfo>(USER_KEY, {}) as UserInfo
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userId: (state) => state.userInfo?.id,
    username: (state) => state.userInfo?.username || state.userInfo?.name || ''
  },

  actions: {
    async login(payload: { username: string; password: string }) {
      const data: any = await post('/user/login', payload)
      this.setToken(data.token)
      this.setUserInfo(data.userInfo || {})
      return data
    },

    setToken(token: string) {
      this.token = token
      storage.set(TOKEN_KEY, token)
    },

    setUserInfo(info: UserInfo) {
      this.userInfo = info
      storage.set(USER_KEY, info)
    },

    async logout() {
      try {
        await post('/user/logout', {})
      } catch {
        // 静默
      }
      this.clear()
    },

    clear() {
      this.token = ''
      this.userInfo = {}
      storage.remove(TOKEN_KEY)
      storage.remove(USER_KEY)
    }
  }
})
