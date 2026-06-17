<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, RefreshCw, Sparkles, Download } from 'lucide-vue-next'
import { ElMessageBox } from 'element-plus'
import { useToast } from '@/composables/useToast'
import AgentTable from '@/components/agent/AgentTable.vue'
import AddAgentDrawer from '@/components/agent/AddAgentDrawer.vue'
import AgentDetailDrawer from '@/components/agent/AgentDetailDrawer.vue'
import AgentCard from '@/components/dashboard/AgentCard.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { mockCategories, mockAgents, type Agent } from '@/components/agent/mockData'

const { isMobile } = useBreakpoint()
const toast = useToast()

const search = ref('')
const statusFilter = ref<'all' | 'enabled' | 'disabled'>('all')
const categoryFilter = ref<string>('all')
const view = ref<'table' | 'grid'>('table')

const agents = ref<Agent[]>([...mockAgents])

const addDrawerOpen = ref(false)
const detailDrawerOpen = ref(false)
const editingAgent = ref<Agent | null>(null)
const currentAgent = ref<Agent | null>(null)

const filtered = computed(() => {
  return agents.value.filter((a) => {
    if (statusFilter.value !== 'all' && a.status !== statusFilter.value) return false
    if (categoryFilter.value !== 'all' && a.category !== categoryFilter.value) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      return a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    }
    return true
  })
})

const stats = computed(() => ({
  total: agents.value.length,
  enabled: agents.value.filter((a) => a.status === 'enabled').length,
  callsToday: agents.value.reduce((sum, a) => sum + a.callsToday, 0),
  totalCalls: agents.value.reduce((sum, a) => sum + a.callsTotal, 0)
}))

function openAdd() {
  editingAgent.value = null
  addDrawerOpen.value = true
}

function openEdit(agent: Agent) {
  editingAgent.value = agent
  addDrawerOpen.value = true
  detailDrawerOpen.value = false
}

function openDetail(agent: Agent) {
  currentAgent.value = agent
  detailDrawerOpen.value = true
}

function handleSubmit(payload: Agent) {
  const idx = agents.value.findIndex((a) => a.id === payload.id)
  if (idx >= 0) agents.value[idx] = payload
  else agents.value.unshift(payload)
}

function handleToggle(agent: Agent) {
  const idx = agents.value.findIndex((a) => a.id === agent.id)
  if (idx >= 0) {
    agents.value[idx] = {
      ...agent,
      status: agent.status === 'enabled' ? 'disabled' : 'enabled',
      updatedAt: new Date().toISOString().split('T')[0]
    }
    toast.success(agent.status === 'enabled' ? '已停用' : '已启用')
  }
}

function handleDelete(agent: Agent) {
  agents.value = agents.value.filter((a) => a.id !== agent.id)
}

async function batchDelete() {
  if (filtered.value.length === 0) return
  try {
    await ElMessageBox.confirm(
      `确定要删除 ${filtered.value.length} 个智能体吗?此操作不可恢复。`,
      '批量删除',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    )
    agents.value = agents.value.filter((a) => !filtered.value.includes(a))
    toast.success(`已删除 ${filtered.value.length} 个智能体`)
  } catch {
    // 取消
  }
}

function refresh() {
  toast.info('刷新(Phase 6 接真实 API)')
}

function exportList() {
  toast.info('导出功能 Phase 5 实装')
}
</script>

<template>
  <div class="agent-page">
    <header class="page-header">
      <div class="header-left">
        <h1 class="page-title">智能体管理</h1>
        <div class="stats">
          <div class="stat">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">总数</span>
          </div>
          <div class="stat stat--success">
            <span class="stat-value">{{ stats.enabled }}</span>
            <span class="stat-label">启用</span>
          </div>
          <div class="stat stat--muted">
            <span class="stat-value">{{ stats.total - stats.enabled }}</span>
            <span class="stat-label">停用</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ stats.callsToday.toLocaleString('zh-CN') }}</span>
            <span class="stat-label">今日调用</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-button action-button--primary" @click="openAdd">
          <Plus :size="16" />
          <span>新建智能体</span>
        </button>
      </div>
    </header>

    <div class="toolbar">
      <div class="search-wrap">
        <Search :size="14" class="search-icon" />
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="搜索名称 / 角色 / 描述"
        />
      </div>

      <div class="filter-group">
        <button
          v-for="s in (['all', 'enabled', 'disabled'] as const)"
          :key="s"
          class="filter-pill"
          :class="{ 'is-active': statusFilter === s }"
          @click="statusFilter = s"
        >
          {{ s === 'all' ? '全部' : s === 'enabled' ? '启用' : '停用' }}
        </button>
      </div>

      <div class="select-wrap">
        <select v-model="categoryFilter" class="select-input">
          <option value="all">所有分类</option>
          <option v-for="c in mockCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
      </div>

      <div class="spacer"></div>

      <div v-if="!isMobile" class="view-toggle">
        <button
          class="view-btn"
          :class="{ 'is-active': view === 'table' }"
          @click="view = 'table'"
          aria-label="表格视图"
        >
          表格
        </button>
        <button
          class="view-btn"
          :class="{ 'is-active': view === 'grid' }"
          @click="view = 'grid'"
          aria-label="卡片视图"
        >
          卡片
        </button>
      </div>

      <button class="icon-btn" @click="refresh" aria-label="刷新">
        <RefreshCw :size="14" />
      </button>
      <button class="icon-btn" @click="exportList" aria-label="导出">
        <Download :size="14" />
      </button>
      <button
        v-if="filtered.length > 0"
        class="action-button action-button--danger"
        @click="batchDelete"
      >
        批量删除 ({{ filtered.length }})
      </button>
    </div>

    <div class="content">
      <AgentTable
        v-if="view === 'table' || isMobile"
        :agents="filtered"
        @view="openDetail"
        @edit="openEdit"
        @toggle="handleToggle"
        @delete="handleDelete"
      />
      <div v-else class="card-grid">
        <AgentCard
          v-for="a in filtered"
          :key="a.id"
          :agent="{
            id: a.id,
            name: a.name,
            role: a.description,
            calls: a.callsToday,
            enabled: a.status === 'enabled'
          }"
          @click="openDetail(a)"
        />
      </div>

      <div v-if="filtered.length === 0" class="empty">
        <p class="empty-text">没有匹配的智能体</p>
        <button class="action-button action-button--primary" @click="search = ''; statusFilter = 'all'; categoryFilter = 'all'">
          清除筛选
        </button>
      </div>
    </div>

    <AddAgentDrawer
      v-model="addDrawerOpen"
      :agent="editingAgent"
      @submit="handleSubmit"
    />

    <AgentDetailDrawer
      v-model="detailDrawerOpen"
      :agent="currentAgent"
      @edit="openEdit"
      @toggle="handleToggle"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/breakpoints' as *;

.agent-page {
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
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @include tablet {
    grid-template-columns: repeat(3, 1fr);
  }

  @include pad {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
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
