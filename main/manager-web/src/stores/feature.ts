// stores/feature.ts
// 功能开关(声纹 / 声纹克隆 / 知识库)

import { defineStore } from 'pinia'

export interface FeatureStatus {
  voiceprintRecognition: boolean
  voiceClone: boolean
  knowledgeBase: boolean
  [key: string]: boolean
}

const STORAGE_KEY = 'featureStatus'

export const useFeatureStore = defineStore('feature', {
  state: () => ({
    status: {
      voiceprintRecognition: false,
      voiceClone: false,
      knowledgeBase: false
    } as FeatureStatus,
    initialized: false
  }),

  getters: {
    voiceprintRecognition: (s) => s.status.voiceprintRecognition,
    voiceClone: (s) => s.status.voiceClone,
    knowledgeBase: (s) => s.status.knowledgeBase
  },

  actions: {
    init(status: Partial<FeatureStatus>) {
      this.status = { ...this.status, ...status }
      this.initialized = true
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.status))
      } catch {
        // 静默
      }
    },

    restore() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) this.status = JSON.parse(raw)
        this.initialized = true
      } catch {
        this.initialized = true
      }
    }
  }
})
