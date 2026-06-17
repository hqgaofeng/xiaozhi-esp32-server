// main.ts — Vue 3 + Vite + Element Plus + Pinia 入口

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import App from './App.vue'
import router from './router/index.ts'

const app = createApp(App)

// Pinia
app.use(createPinia())

// Element Plus
app.use(ElementPlus, { locale: zhCn })

// Vue Router
app.use(router)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Error]', err, info)
}

app.mount('#app')
