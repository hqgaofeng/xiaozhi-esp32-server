// stores/config.ts
// 公共配置(version / 备案号 / SM2 公钥 / 注册开关等)

import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import { get } from '@/api/http'

const CONFIG_KEY = 'pubConfig'

export interface PubConfig {
  version: string
  beianIcpNum: string
  beianGaNum: string
  allowUserRegister: boolean
  sm2PublicKey: string
  [key: string]: any
}

const DEFAULT_CONFIG: PubConfig = {
  version: '',
  beianIcpNum: '',
  beianGaNum: '',
  allowUserRegister: false,
  sm2PublicKey: ''
}

export const useConfigStore = defineStore('config', {
  state: () => ({
    pubConfig: storage.get<PubConfig>(CONFIG_KEY, DEFAULT_CONFIG) as PubConfig
  }),

  getters: {
    version: (state) => state.pubConfig.version,
    canRegister: (state) => !!state.pubConfig.allowUserRegister,
    sm2PublicKey: (state) => state.pubConfig.sm2PublicKey
  },

  actions: {
    async fetchPubConfig() {
      const data: any = await get('/user/getPubConfig')
      this.setConfig(data || DEFAULT_CONFIG)
      return data
    },

    setConfig(config: PubConfig) {
      this.pubConfig = { ...DEFAULT_CONFIG, ...config }
      storage.set(CONFIG_KEY, this.pubConfig)
    }
  }
})
