<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { Home, Smartphone, Mic, MessageSquare, User } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
  { path: '/home', label: '概览', icon: Home },
  { path: '/device-management', label: '设备', icon: Smartphone },
  { path: '/home', label: '唤醒', icon: Mic, isCenter: true },
  { path: '/knowledge-base-management', label: '对话', icon: MessageSquare },
  { path: '/user-management', label: '我的', icon: User }
]

const activePath = computed(() => route.path)

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="tabbar">
    <button
      v-for="tab in tabs"
      :key="tab.label"
      class="tab"
      :class="{
        'is-active': !tab.isCenter && activePath.startsWith(tab.path),
        'is-center': tab.isCenter
      }"
      @click="go(tab.path)"
    >
      <component :is="tab.icon" :size="20" class="tab-icon" />
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.tabbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 0;
  color: var(--color-text-tertiary);
  transition: color 120ms var(--ease-standard);
  position: relative;
  min-width: 44px;
  min-height: 44px;
  justify-content: center;

  &.is-active {
    color: var(--color-primary);
  }
}

.tab-icon {
  flex-shrink: 0;
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
}

// 中央唤醒按钮 — 突出(不凸出,保持基线)
.tab.is-center {
  flex: 0 0 auto;
  margin: 0 4px;

  .tab-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-accent);
    color: white;
    padding: 8px;
    box-shadow: 0 4px 12px rgba(255, 122, 69, 0.4);
    transition: transform 120ms var(--ease-standard);
  }

  &:active .tab-icon {
    transform: scale(0.95);
  }

  .tab-label {
    margin-top: 2px;
  }
}
</style>
