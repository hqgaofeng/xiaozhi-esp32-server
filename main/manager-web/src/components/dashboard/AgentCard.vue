<script setup lang="ts">
import { Bot, MoreHorizontal, Edit3, BarChart3, Power } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Agent {
  id: string
  name: string
  role: string
  calls: number
  enabled: boolean
  description?: string
}

const props = withDefaults(defineProps<{
  agent: Agent
}>(), {})

const router = useRouter()
const menuOpen = ref(false)

function toggleMenu(e: MouseEvent) {
  e.stopPropagation()
  menuOpen.value = !menuOpen.value
}

function closeMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.menu-wrap')) {
    menuOpen.value = false
  }
}

function goDetail() {
  router.push('/agent-template-management')
}

function goEdit(e: Event) {
  e.stopPropagation()
  menuOpen.value = false
  router.push('/agent-template-management')
}

function goStats(e: Event) {
  e.stopPropagation()
  menuOpen.value = false
  router.push('/server-side-management')
}

function toggleEnabled(e: Event) {
  e.stopPropagation()
  menuOpen.value = false
  // Phase 4 实装
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<template>
  <div
    class="agent-card"
    :class="{ 'is-disabled': !agent.enabled }"
    @click="goDetail"
  >
    <div class="card-header">
      <div class="avatar">
        <Bot :size="20" />
      </div>
      <span v-if="agent.enabled" class="status status-dot--online"></span>
      <span v-else class="status status-dot--offline"></span>

      <div class="menu-wrap">
        <button class="menu-btn" @click="toggleMenu" aria-label="更多操作">
          <MoreHorizontal :size="16" />
        </button>
        <Transition name="dropdown">
          <div v-if="menuOpen" class="menu">
            <button class="menu-item" @click="goEdit">
              <Edit3 :size="14" />
              <span>编辑</span>
            </button>
            <button class="menu-item" @click="goStats">
              <BarChart3 :size="14" />
              <span>调用统计</span>
            </button>
            <button class="menu-item menu-item--danger" @click="toggleEnabled">
              <Power :size="14" />
              <span>{{ agent.enabled ? '停用' : '启用' }}</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <div class="card-body">
      <h3 class="name">{{ agent.name }}</h3>
      <p class="role">{{ agent.role }}</p>
    </div>

    <div class="card-footer">
      <div class="metric">
        <span class="metric-value">{{ agent.calls.toLocaleString('zh-CN') }}</span>
        <span class="metric-label">今日调用</span>
      </div>
      <div class="metric-status" :class="{ 'is-on': agent.enabled }">
        {{ agent.enabled ? '运行中' : '已停用' }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.agent-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  cursor: pointer;
  transition: all 200ms var(--ease-standard);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 152px;
  position: relative;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    border-color: var(--color-primary-light-3);
  }

  &.is-disabled {
    opacity: 0.6;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: -4px;
  flex-shrink: 0;
}

.status-dot--online {
  background: var(--color-success);
  box-shadow: 0 0 0 2px var(--color-success-light);
  animation: pulse-success 1.6s ease-in-out infinite;
}

.status-dot--offline {
  background: var(--color-text-tertiary);
}

@keyframes pulse-success {
  0%, 100% { box-shadow: 0 0 0 2px var(--color-success-light); }
  50% { box-shadow: 0 0 0 6px var(--color-success-light); }
}

.menu-wrap {
  margin-left: auto;
  position: relative;
}

.menu-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-bg-page);
    color: var(--color-text-primary);
  }
}

.menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 140px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  z-index: 50;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 13px;
  color: var(--color-text-primary);
  text-align: left;

  &:hover {
    background: var(--color-bg-page);
  }

  &--danger {
    color: var(--color-danger);
    &:hover {
      background: var(--color-danger-light);
    }
  }
}

.card-body {
  flex: 1;
  min-height: 0;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.role {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--color-divider);
}

.metric {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

.metric-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.metric-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: var(--color-bg-page);
  color: var(--color-text-tertiary);

  &.is-on {
    background: var(--color-success-light);
    color: var(--color-success);
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 120ms var(--ease-standard), transform 120ms var(--ease-standard);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
