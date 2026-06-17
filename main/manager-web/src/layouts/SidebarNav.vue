<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import {
  LayoutDashboard,
  Bot,
  Smartphone,
  MessageSquare,
  AudioLines,
  BookOpen,
  Activity,
  Settings,
  Code2,
  CircleDot
} from 'lucide-vue-next'
import { useConfigStore } from '@/stores/config'

const route = useRoute()
const router = useRouter()
const config = useConfigStore()

interface NavItem {
  path: string
  name: string
  label: string
  icon: any
  badge?: number | string
}

const items: NavItem[] = [
  { path: '/home', name: 'Home', label: '概览', icon: LayoutDashboard },
  { path: '/agent-template-management', name: 'AgentTemplateManagement', label: '智能体', icon: Bot },
  { path: '/device-management', name: 'DeviceManagement', label: '设备', icon: Smartphone },
  { path: '/knowledge-base-management', name: 'KnowledgeBaseManagement', label: '对话记录', icon: MessageSquare },
  { path: '/voice-resource-management', name: 'VoiceResourceManagement', label: '语音资源', icon: AudioLines },
  { path: '/knowledge-base-management', name: 'KnowledgeBaseManagement2', label: '知识库', icon: BookOpen },
  { path: '/server-side-management', name: 'ServerSideManager', label: '智控台', icon: Activity },
  { path: '/feature-management', name: 'FeatureManagement', label: '系统配置', icon: Settings },
  { path: '/server-side-management', name: 'Developer', label: '开发者', icon: Code2 }
]

const activePath = computed(() => route.path)

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="sidebar">
    <div class="brand">
      <div class="brand-logo">
        <CircleDot :size="20" class="text-accent" />
      </div>
      <div class="brand-text">
        <div class="brand-name">小智智控台</div>
        <div class="brand-tagline">v2 · Refactor</div>
      </div>
    </div>

    <nav class="nav">
      <button
        v-for="item in items"
        :key="item.label"
        class="nav-item"
        :class="{ 'is-active': activePath.startsWith(item.path) }"
        @click="go(item.path)"
      >
        <component :is="item.icon" :size="18" class="nav-icon" />
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </nav>

    <div class="footer">
      <div class="status">
        <span class="status-dot status-dot--online"></span>
        <span>服务在线</span>
      </div>
      <div class="version">{{ config.version || '—' }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  flex: 1;
  min-width: 0;
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-on-dark);
  line-height: 1.3;
}

.brand-tagline {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--font-mono);
  margin-top: 2px;
}

.nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  transition: all 120ms var(--ease-standard);
  text-align: left;
  width: 100%;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.95);
  }

  &.is-active {
    background: var(--color-primary);
    color: white;
    box-shadow: 0 2px 8px rgba(79, 107, 255, 0.3);
  }
}

.nav-icon {
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.footer {
  padding: 16px 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.version {
  font-family: var(--font-mono);
}
</style>
