<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, LayoutGrid, List, RefreshCw, Download } from 'lucide-vue-next'
import { ElMessageBox } from 'element-plus'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useToast } from '@/composables/useToast'

import DeviceTable from '@/components/device/DeviceTable.vue'
import DeviceCard from '@/components/dashboard/DeviceCard.vue'
import AddDeviceDrawer from '@/components/device/AddDeviceDrawer.vue'
import DeviceDetailDrawer from '@/components/device/DeviceDetailDrawer.vue'

import { mockDevices, mockRooms, type Device } from '@/components/device/mockData'

const { isMobile, isPad, breakpoint } = useBreakpoint()
const toast = useToast()

// === 状态 ===
const search = ref('')
const statusFilter = ref<'all' | 'online' | 'offline' | 'error'>('all')
const roomFilter = ref<string>('all')
const view = ref<'table' | 'grid' | 'list'>('table')
const addDrawerOpen = ref(false)
const detailDrawerOpen = ref(false)
const currentDevice = ref<Device | null>(null)

// === 列表 ===
const devices = ref<Device[]>([...mockDevices])

// === 计算 ===
const filtered = computed(() => {
  return devices.value.filter((d) => {
    if (statusFilter.value !== 'all' && d.status !== statusFilter.value) return false
    if (roomFilter.value !== 'all' && d.room !== roomFilter.value) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      return d.name.toLowerCase().includes(q) || d.mac.toLowerCase().includes(q) || d.agent.toLowerCase().includes(q)
    }
    return true
  })
})

const onlineCount = computed(() => devices.value.filter((d) => d.status === 'online').length)
const offlineCount = computed(() => devices.value.filter((d) => d.status === 'offline').length)
const errorCount = computed(() => devices.value.filter((d) => d.status === 'error').length)

// === 自动选 view ===
const effectiveView = computed(() => {
  if (isMobile) return 'list'
  if (isPad) return 'grid'
  return view.value
})

// === 事件 ===
function openAdd() {
  addDrawerOpen.value = true
}

function openDetail(d: Device) {
  currentDevice.value = d
  detailDrawerOpen.value = true
}

function handleDelete(d: Device) {
  devices.value = devices.value.filter((x) => x.id !== d.id)
}

function handleSave(payload: Device) {
  const idx = devices.value.findIndex((x) => x.id === payload.id)
  if (idx >= 0) devices.value[idx] = payload
  else devices.value.unshift(payload)
}

async function batchDelete() {
  if (filtered.value.length === 0) return
  try {
    await ElMessageBox.confirm(
      `确定要解绑 ${filtered.value.length} 台设备吗?此操作不可恢复。`,
      '批量解绑',
      { confirmButtonText: '解绑', cancelButtonText: '取消', type: 'warning' }
    )
    devices.value = devices.value.filter((d) => !filtered.value.includes(d))
    toast.success(`已解绑 ${filtered.value.length} 台设备`)
  } catch {
    // 取消
  }
}

function refresh() {
  toast.info('刷新(Phase 6 接真实 API)')
}
</script>

<template>
  <div class="device-page" :class="`bp-${breakpoint}`">
    <!-- 顶栏 -->
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">设备管理</h1>
        <div class="stats">
          <div class="stat">
            <span class="stat-value">{{ devices.length }}</span>
            <span class="stat-label">总数</span>
          </div>
          <div class="stat stat--success">
            <span class="stat-value">{{ onlineCount }}</span>
            <span class="stat-label">在线</span>
          </div>
          <div class="stat stat--muted">
            <span class="stat-value">{{ offlineCount }}</span>
            <span class="stat-label">离线</span>
          </div>
          <div v-if="errorCount > 0" class="stat stat--danger">
            <span class="stat-value">{{ errorCount }}</span>
            <span class="stat-label">故障</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-button action-button--primary" @click="openAdd">
          <Plus :size="16" />
          <span>添加设备</span>
        </button>
      </div>
    </header>

    <!-- 工具条 -->
    <div class="toolbar">
      <div class="search-wrap">
        <Search :size="14" class="search-icon" />
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="搜索名称 / MAC / 智能体"
        />
      </div>

      <div class="filter-group">
        <button
          v-for="s in (['all', 'online', 'offline', 'error'] as const)"
          :key="s"
          class="filter-pill"
          :class="{ 'is-active': statusFilter === s }"
          @click="statusFilter = s"
        >
          {{ s === 'all' ? '全部' : s === 'online' ? '在线' : s === 'offline' ? '离线' : '故障' }}
        </button>
      </div>

      <div class="select-wrap">
        <select v-model="roomFilter" class="select-input">
          <option value="all">所有房间</option>
          <option v-for="r in mockRooms" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <div class="spacer"></div>

      <!-- 视图切换(只在桌面显示) -->
      <div v-if="!isMobile && !isPad" class="view-toggle">
        <button
          class="view-btn"
          :class="{ 'is-active': view === 'table' }"
          @click="view = 'table'"
          aria-label="表格视图"
        >
          <List :size="14" />
        </button>
        <button
          class="view-btn"
          :class="{ 'is-active': view === 'grid' }"
          @click="view = 'grid'"
          aria-label="卡片视图"
        >
          <LayoutGrid :size="14" />
        </button>
      </div>

      <button class="icon-btn" @click="refresh" aria-label="刷新">
        <RefreshCw :size="14" />
      </button>
      <button class="icon-btn" @click="toast.info('导出功能 Phase 5 实装')" aria-label="导出">
        <Download :size="14" />
      </button>
      <button
        v-if="filtered.length > 0"
        class="action-button action-button--danger"
        @click="batchDelete"
      >
        批量解绑 ({{ filtered.length }})
      </button>
    </div>

    <!-- 内容区 -->
    <div class="content">
      <DeviceTable
        v-if="effectiveView === 'table'"
        :devices="filtered"
        @view="openDetail"
        @delete="handleDelete"
      />
      <div v-else-if="effectiveView === 'grid'" class="card-grid">
        <DeviceCard
          v-for="d in filtered"
          :key="d.id"
          :device="d"
          @click="openDetail(d)"
        />
      </div>
      <div v-else class="card-list">
        <DeviceCard
          v-for="d in filtered"
          :key="d.id"
          :device="d"
          @click="openDetail(d)"
        />
      </div>

      <div v-if="filtered.length === 0" class="empty">
        <p class="empty-text">没有匹配的设备</p>
        <button class="action-button action-button--primary" @click="search = ''; statusFilter = 'all'; roomFilter = 'all'">
          清除筛选
        </button>
      </div>
    </div>

    <!-- Drawers -->
    <AddDeviceDrawer v-model="addDrawerOpen" @submit="handleSave" />
    <DeviceDetailDrawer v-model="detailDrawerOpen" :device="currentDevice" @save="handleSave" />
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/breakpoints' as *;

.device-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1600px;
  margin: 0 auto;

  @include mobile {
    padding: 16px;
    gap: 12px;
  }
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.stats {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;

  .stat-value {
    font-weight: 600;
    color: var(--color-text-primary);
    font-family: var(--font-sans);
  }

  .stat-label {
    color: var(--color-text-tertiary);
  }

  &--success .stat-value {
    color: var(--color-success);
  }
  &--danger .stat-value {
    color: var(--color-danger);
  }
  &--muted .stat-value {
    color: var(--color-text-tertiary);
  }
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  transition: all 120ms var(--ease-standard);

  &--primary {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);

    &:hover {
      background: var(--color-primary-hover);
    }
  }

  &--danger {
    color: var(--color-danger);
    border-color: var(--color-danger-light);

    &:hover {
      background: var(--color-danger-light);
    }
  }
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @include mobile {
    flex-direction: column;
    align-items: stretch;
  }
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 280px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  padding: 0 12px;
  transition: all 120ms var(--ease-standard);

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
  }

  @include mobile {
    width: 100%;
  }
}

.search-icon {
  color: var(--color-text-tertiary);
}

.search-input {
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  margin-left: 8px;
  min-width: 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: var(--color-bg-page);
  border-radius: var(--radius-sm);
}

.filter-pill {
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-radius: 4px;
  transition: all 120ms var(--ease-standard);

  &:hover {
    color: var(--color-text-primary);
  }

  &.is-active {
    background: var(--color-bg-surface);
    color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }
}

.select-wrap {
  position: relative;
}

.select-input {
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  padding: 0 32px 0 12px;
  font-size: 13px;
  color: var(--color-text-primary);
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239AA3B5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
  transition: all 120ms var(--ease-standard);

  &:focus {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
  }
}

.spacer {
  flex: 1;
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: var(--color-bg-page);
  border-radius: var(--radius-sm);
}

.view-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  border-radius: 4px;
  transition: all 120ms var(--ease-standard);

  &.is-active {
    background: var(--color-bg-surface);
    color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }
}

.icon-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  background: var(--color-bg-surface);
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-bg-page);
    color: var(--color-text-primary);
  }
}

.content {
  min-height: 400px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty {
  padding: 64px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-text {
  color: var(--color-text-tertiary);
  font-size: 14px;
  margin: 0;
}
</style>
