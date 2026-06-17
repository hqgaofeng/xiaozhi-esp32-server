<script setup lang="ts">
// CSS 变量必须先 import,Vite 才会把它注入到 <head>
import '@/styles/tokens.css'
import '@/styles/element-plus-overrides.css'

import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useConfigStore } from '@/stores/config'
import { useFeatureStore } from '@/stores/feature'
import { useEventBus } from '@/composables/useEventBus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const auth = useAuthStore()
const config = useConfigStore()
const feature = useFeatureStore()
const bus = useEventBus()

// 登录/注册/找回 走全屏布局,不走 DefaultLayout
const isAuthPage = computed(() =>
  ['Welcome', 'Login', 'Register', 'RetrievePassword'].includes(route.name as string)
)

onMounted(async () => {
  feature.restore()
  try {
    await config.fetchPubConfig()
  } catch (e) {
    console.warn('fetch pub config failed:', e)
  }

  bus.on('auth:logout', () => {
    auth.clear()
  })
})
</script>

<template>
  <el-config-provider>
    <!-- 登录/注册/找回:全屏布局 -->
    <template v-if="isAuthPage">
      <router-view />
    </template>
    <!-- 业务页:壳布局 -->
    <DefaultLayout v-else />
  </el-config-provider>
</template>

<style lang="scss">
@use '@/styles/reset.scss';
@use '@/styles/element-overrides.scss';
@use '@/styles/global.scss';
</style>
