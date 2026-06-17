<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { useConfigStore } from '@/stores/config'
import { Mic, Sparkles, Monitor, Smartphone, Tablet } from 'lucide-vue-next'

const route = useRoute()
const { width, isMobile, isPad, isDesktop, breakpoint } = useBreakpoint()
const toast = useToast()
const auth = useAuthStore()
const config = useConfigStore()

function testToast() {
  toast.success('🎉 设计 token 加载成功!')
  toast.info(`当前断点: ${breakpoint.value} (${width.value}px)`)
}

function testStore() {
  console.log('auth:', auth.userInfo)
  console.log('config:', config.pubConfig)
  toast.info('Store 已注入,查看 console')
}
</script>

<template>
  <div class="placeholder">
    <div class="card">
      <div class="brand">
        <Sparkles :size="32" class="sparkle" />
        <h1>小智智控台 v2</h1>
      </div>

      <p class="subtitle">Phase 1 基础设施已就绪</p>

      <div class="info-grid">
        <div class="info-item">
          <span class="label">当前路由</span>
          <code>{{ route.fullPath }}</code>
        </div>
        <div class="info-item">
          <span class="label">视窗宽度</span>
          <code>{{ width }}px</code>
        </div>
        <div class="info-item">
          <span class="label">断点档</span>
          <code class="badge">{{ breakpoint }}</code>
        </div>
        <div class="info-item">
          <span class="label">设备类型</span>
          <div class="device-icons">
            <Smartphone v-if="isMobile" :size="20" class="text-primary" />
            <Tablet v-else-if="isPad" :size="20" class="text-primary" />
            <Monitor v-else-if="isDesktop" :size="20" class="text-primary" />
          </div>
        </div>
      </div>

      <div class="actions">
        <el-button type="primary" @click="testToast">
          <Mic :size="16" style="margin-right: 4px; vertical-align: -2px;" />
          测试 Toast
        </el-button>
        <el-button @click="testStore">测试 Store</el-button>
      </div>

      <div class="checklist">
        <h3>Phase 1 验收项</h3>
        <ul>
          <li>✅ Vue 3.5 + Vite 5 启动</li>
          <li>✅ Element Plus 2.x + 主色 #4F6BFF</li>
          <li>✅ Pinia 2 + 3 个 store</li>
          <li>✅ Lucide Icons 加载</li>
          <li>✅ 设计 token 全局生效</li>
          <li>✅ 响应式 5 档断点判断</li>
          <li>✅ 旧 23 个 view 暂未迁移,等 Phase 2+ 推进</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.placeholder {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-bg-page);
}

.card {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 40px;
  max-width: 640px;
  width: 100%;
  border: 1px solid var(--color-border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;

  .sparkle {
    color: var(--color-accent);
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
  }
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 15px;
  margin-bottom: 32px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 639px) {
    grid-template-columns: 1fr;
  }
}

.info-item {
  background: var(--color-bg-page);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 12px;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  code {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--color-text-primary);
  }

  .badge {
    display: inline-block;
    background: var(--color-primary-light);
    color: var(--color-primary);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
  }

  .device-icons {
    display: flex;
    align-items: center;
    height: 20px;
  }
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.checklist {
  background: var(--color-bg-page);
  border-radius: var(--radius-md);
  padding: 20px;

  h3 {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    font-size: 14px;
    color: var(--color-text-primary);
    line-height: 1.5;
  }
}
</style>
