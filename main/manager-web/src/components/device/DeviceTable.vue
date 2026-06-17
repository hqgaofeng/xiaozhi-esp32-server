<script setup lang="ts">
import { MoreHorizontal, MessageSquare, Settings, RefreshCw, Trash2, Copy } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useToast } from '@/composables/useToast'
import { maskMac } from '@/utils/format'
import type { Device } from './mockData'

defineProps<{
  devices: Device[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'view', device: Device): void
  (e: 'delete', device: Device): void
  (e: 'refresh'): void
}>()

const router = useRouter()
const toast = useToast()
const menuOpen = ref<string | null>(null)

const statusMap = {
  online: { label: '在线', class: 'status-dot--online' },
  offline: { label: '离线', class: 'status-dot--offline' },
  error: { label: '故障', class: 'status-dot--error' }
} as const

function toggleMenu(id: string, e: Event) {
  e.stopPropagation()
  menuOpen.value = menuOpen.value === id ? null : id
}

function closeMenu() {
  menuOpen.value = null
}

function viewDetail(device: Device) {
  emit('view', device)
}

function viewChat(device: Device) {
  router.push('/knowledge-base-management')
  toast.info(`查看 ${device.name} 对话记录(Phase 4 详情页实装)`)
}

function viewSettings(device: Device) {
  emit('view', device)
  setTimeout(() => closeMenu(), 0)
}

function viewOTA(device: Device, e: Event) {
  e.stopPropagation()
  router.push('/ota-management')
  closeMenu()
}

async function confirmDelete(device: Device, e: Event) {
  e.stopPropagation()
  closeMenu()
  try {
    await ElMessageBox.confirm(
      `确定要解绑设备 "${device.name}" 吗?此操作不可恢复。`,
      '解绑设备',
      { confirmButtonText: '解绑', cancelButtonText: '取消', type: 'warning' }
    )
    emit('delete', device)
    toast.success('设备已解绑')
  } catch {
    // 取消
  }
}

function copyMac(mac: string, e: Event) {
  e.stopPropagation()
  navigator.clipboard.writeText(mac)
  toast.success('MAC 已复制')
}
</script>

<template>
  <div class="table-wrap">
    <table class="device-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>MAC</th>
          <th>状态</th>
          <th>智能体</th>
          <th>房间</th>
          <th>今日对话</th>
          <th>最后活跃</th>
          <th class="th-actions">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="8" class="td-loading">加载中...</td>
        </tr>
        <tr v-else-if="devices.length === 0">
          <td colspan="8" class="td-empty">
            <div class="empty-block">暂无设备</div>
          </td>
        </tr>
        <tr
          v-for="d in devices"
          :key="d.id"
          @click="viewDetail(d)"
          class="data-row"
        >
          <td>
            <div class="name-cell">
              <div class="device-icon" :class="`is-${d.status}`">📱</div>
              <div class="name-info">
                <div class="name-text">{{ d.name }}</div>
                <div class="model-text">{{ d.model }}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="mac-cell" @click="copyMac(d.mac, $event)">
              <code>{{ maskMac(d.mac, 4) }}</code>
              <Copy :size="12" class="copy-icon" />
            </div>
          </td>
          <td>
            <div class="status-cell">
              <span class="status-dot" :class="statusMap[d.status].class"></span>
              <span>{{ statusMap[d.status].label }}</span>
            </div>
          </td>
          <td>
            <span class="agent-tag">{{ d.agent }}</span>
          </td>
          <td>{{ d.room }}</td>
          <td class="num-cell">{{ d.callsToday }}</td>
          <td class="muted">{{ d.lastActive }}</td>
          <td class="td-actions" @click.stop>
            <div class="menu-wrap">
              <button class="menu-btn" @click="toggleMenu(d.id, $event)">
                <MoreHorizontal :size="16" />
              </button>
              <Transition name="dropdown">
                <div v-if="menuOpen === d.id" class="menu" @click="closeMenu">
                  <button class="menu-item" @click="viewChat(d)">
                    <MessageSquare :size="14" />
                    <span>对话历史</span>
                  </button>
                  <button class="menu-item" @click="viewSettings(d)">
                    <Settings :size="14" />
                    <span>设置</span>
                  </button>
                  <button class="menu-item" @click="viewOTA(d, $event)">
                    <RefreshCw :size="14" />
                    <span>OTA 升级</span>
                  </button>
                  <div class="menu-divider"></div>
                  <button class="menu-item menu-item--danger" @click="confirmDelete(d, $event)">
                    <Trash2 :size="14" />
                    <span>解绑设备</span>
                  </button>
                </div>
              </Transition>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.table-wrap {
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.device-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: var(--color-bg-page);
}

th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 12px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--color-border);

  &.th-actions {
    text-align: right;
  }
}

td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-divider);
  color: var(--color-text-primary);
  vertical-align: middle;
}

.data-row {
  cursor: pointer;
  transition: background 120ms var(--ease-standard);

  &:hover {
    background: var(--color-primary-light);
  }

  &:last-child td {
    border-bottom: 0;
  }
}

.td-loading,
.td-empty {
  text-align: center;
  color: var(--color-text-tertiary);
  padding: 48px 16px;
}

.empty-block {
  font-size: 14px;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.device-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;

  &.is-offline,
  &.is-error {
    background: var(--color-bg-page);
    color: var(--color-text-tertiary);
  }
}

.name-info {
  min-width: 0;
}

.name-text {
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.model-text {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
  font-family: var(--font-mono);
}

.mac-cell {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 120ms var(--ease-standard);

  &:hover {
    background: var(--color-bg-page);

    .copy-icon {
      opacity: 1;
    }
  }

  code {
    font-family: var(--font-mono);
    font-size: 12px;
  }
}

.copy-icon {
  color: var(--color-text-tertiary);
  opacity: 0;
  transition: opacity 120ms;
}

.status-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
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

.agent-tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.num-cell {
  font-family: var(--font-mono);
  font-weight: 500;
}

.muted {
  color: var(--color-text-tertiary);
  font-size: 13px;
}

.td-actions {
  text-align: right;
}

.menu-wrap {
  position: relative;
  display: inline-block;
}

.menu-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
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
  min-width: 160px;
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

.menu-divider {
  height: 1px;
  background: var(--color-divider);
  margin: 4px 0;
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
