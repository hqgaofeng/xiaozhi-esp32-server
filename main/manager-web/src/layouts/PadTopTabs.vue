<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { LayoutDashboard, Smartphone, BookOpen, MessageSquare, Settings, Menu } from 'lucide-vue-next'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

interface Tab {
  path: string
  label: string
  icon: any
}

const tabs: Tab[] = [
  { path: '/home', label: '概览', icon: LayoutDashboard },
  { path: '/device-management', label: '设备', icon: Smartphone },
  { path: '/knowledge-base-management', label: '对话', icon: MessageSquare },
  { path: '/voice-resource-management', label: '语音', icon: BookOpen }
]

const moreOpen = ref(false)
const moreItems = [
  { path: '/agent-template-management', label: '智能体' },
  { path: '/server-side-management', label: '智控台' },
  { path: '/feature-management', label: '配置' }
]

const activePath = computed(() => route.path)

function go(path: string) {
  router.push(path)
  moreOpen.value = false
}
</script>

<template>
  <div class="pad-tabs">
    <div class="tabs-list">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        class="tab"
        :class="{ 'is-active': activePath.startsWith(tab.path) }"
        @click="go(tab.path)"
      >
        <component :is="tab.icon" :size="16" />
        <span>{{ tab.label }}</span>
      </button>

      <div class="more-wrap">
        <button
          class="tab tab--more"
          :class="{ 'is-active': moreOpen }"
          @click="moreOpen = !moreOpen"
        >
          <Menu :size="16" />
          <span>更多</span>
        </button>
        <Transition name="dropdown">
          <div v-if="moreOpen" class="more-dropdown">
            <button
              v-for="item in moreItems"
              :key="item.path"
              class="more-item"
              @click="go(item.path)"
            >
              {{ item.label }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pad-tabs {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.tabs-list {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 120ms var(--ease-standard);
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: var(--color-bg-page);
    color: var(--color-text-primary);
  }

  &.is-active {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
}

.more-wrap {
  position: relative;
}

.more-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 160px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  z-index: 200;
}

.more-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--color-text-primary);

  &:hover {
    background: var(--color-bg-page);
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 120ms var(--ease-standard);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style>
