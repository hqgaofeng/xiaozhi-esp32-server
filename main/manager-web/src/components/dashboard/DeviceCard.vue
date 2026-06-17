<script setup lang="ts">
import { Smartphone, MoreHorizontal, Settings, RefreshCw, Wifi, WifiOff } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { maskMac } from '@/utils/format'

interface Device {
  id: string
  name: string
  mac: string
  status: 'online' | 'offline' | 'error'
  agent?: string
  callsToday: number
  wakesToday: number
  lastActive: string
  signal?: 'strong' | 'medium' | 'weak' | 'offline'
}

const props = defineProps<{
  device: Device
}>()

const router = useRouter()
const menuOpen = ref(false)

const statusText = computed(() => {
  switch (props.device.status) {
    case 'online': return '在线'
    case 'offline': return '离线'
    case 'error': return '故障'
  }
})

const statusClass = computed(() => {
  switch (props.device.status) {
    case 'online': return 'status-dot--online'
    case 'offline': return 'status-dot--offline'
    case 'error': return 'status-dot--error'
  }
})

function goDetail() {
  router.push('/device-management')
}

function toggleMenu(e: Event) {
  e.stopPropagation()
  menuOpen.value = !menuOpen.value
}

function closeMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.menu-wrap')) {
    menuOpen.value = false
  }
}

function goSettings(e: Event) {
  e.stopPropagation()
  menuOpen.value = false
  router.push('/device-management')
}

function goOTA(e: Event) {
  e.stopPropagation()
  menuOpen.value = false
  router.push('/ota-management')
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
    class="device-card"
    :class="`is-${device.status}`"
    @click="goDetail"
  >
    <div class="card-header">
      <div class="device-icon">
        <Smartphone :size="20" />
      </div>
      <span class="status" :class="statusClass"></span>

      <div class="menu-wrap">
        <button class="menu-btn" @click="toggleMenu" aria-label="更多操作">
          <MoreHorizontal :size="16" />
        </button>
        <Transition name="dropdown">
          <div v-if="menuOpen" class="menu">
            <button class="menu-item" @click="goSettings">
              <Settings :size="14" />
              <span>设置</span>
            </button>
            <button class="menu-item" @click="goOTA">
              <RefreshCw :size="14" />
              <span>OTA 升级</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <div class="card-body">
      <h3 class="name">{{ device.name }}</h3>
      <p class="mac">{{ maskMac(device.mac, 4) }}</p>
    </div>

    <div class="card-meta">
      <div v-if="device.agent" class="agent-tag">
        <span class="tag-label">智能体</span>
        <span class="tag-value">{{ device.agent }}</span>
      </div>
      <div class="signal" v-if="device.signal">
        <Wifi v-if="device.signal !== 'offline'" :size="14" />
        <WifiOff v-else :size="14" />
      </div>
    </div>

    <div class="card-footer">
      <div class="metric">
        <span class="metric-value">{{ device.callsToday }}</span>
        <span class="metric-label">对话</span>
      </div>
      <div class="divider"></div>
      <div class="metric">
        <span class="metric-value">{{ device.wakesToday }}</span>
        <span class="metric-label">唤醒</span>
      </div>
      <div class="divider"></div>
      <div class="status-text">{{ statusText }} · {{ device.lastActive }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.device-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  cursor: pointer;
  transition: all 200ms var(--ease-standard);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 168px;
  position: relative;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
    border-color: var(--color-primary-light-3);
  }

  &.is-offline {
    opacity: 0.75;
  }

  &.is-error {
    border-color: var(--color-danger-light);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.device-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.is-offline .device-icon,
.is-error .device-icon {
  background: var(--color-bg-page);
  color: var(--color-text-tertiary);
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

.status-dot--error {
  background: var(--color-danger);
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
  min-width: 130px;
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

.mac {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin: 0;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.agent-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  flex: 1;
  min-width: 0;

  .tag-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
  }

  .tag-label {
    color: var(--color-primary);
    opacity: 0.7;
    flex-shrink: 0;
  }
}

.signal {
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--color-divider);
}

.metric {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

.metric-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.divider {
  width: 1px;
  height: 12px;
  background: var(--color-divider);
}

.status-text {
  margin-left: auto;
  font-size: 11px;
  color: var(--color-text-tertiary);
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
