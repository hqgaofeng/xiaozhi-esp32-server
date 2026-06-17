<script setup lang="ts">
import { MoreHorizontal, Edit3, BarChart3, Power, Trash2, MessageSquare } from 'lucide-vue-next'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useToast } from '@/composables/useToast'
import type { Agent } from './mockData'

defineProps<{
  agents: Agent[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'view', agent: Agent): void
  (e: 'edit', agent: Agent): void
  (e: 'toggle', agent: Agent): void
  (e: 'delete', agent: Agent): void
}>()

const toast = useToast()
const menuOpen = ref<string | null>(null)

function toggleMenu(id: string, e: Event) {
  e.stopPropagation()
  menuOpen.value = menuOpen.value === id ? null : id
}

function closeMenu() {
  menuOpen.value = null
}

function viewDetail(agent: Agent) {
  emit('view', agent)
}

function viewChat(agent: Agent) {
  toast.info(`查看 ${agent.name} 对话记录`)
  closeMenu()
}

function viewStats(agent: Agent, e: Event) {
  e.stopPropagation()
  toast.info(`${agent.name} 调用统计(Phase 5 实装)`)
  closeMenu()
}

function editAgent(agent: Agent, e: Event) {
  e.stopPropagation()
  emit('edit', agent)
  closeMenu()
}

function toggleAgent(agent: Agent, e: Event) {
  e.stopPropagation()
  emit('toggle', agent)
  closeMenu()
}

async function confirmDelete(agent: Agent, e: Event) {
  e.stopPropagation()
  closeMenu()
  try {
    await ElMessageBox.confirm(
      `确定要删除智能体 "${agent.name}" 吗?此操作不可恢复。`,
      '删除智能体',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    )
    emit('delete', agent)
    toast.success('智能体已删除')
  } catch {
    // 取消
  }
}
</script>

<template>
  <div class="table-wrap">
    <table class="agent-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>角色</th>
          <th>状态</th>
          <th>记忆</th>
          <th>声纹</th>
          <th>今日调用</th>
          <th>累计调用</th>
          <th>更新时间</th>
          <th class="th-actions">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="9" class="td-loading">加载中...</td>
        </tr>
        <tr v-else-if="agents.length === 0">
          <td colspan="9" class="td-empty">
            <div class="empty-block">暂无智能体</div>
          </td>
        </tr>
        <tr
          v-for="a in agents"
          :key="a.id"
          @click="viewDetail(a)"
          class="data-row"
        >
          <td>
            <div class="name-cell">
              <div class="avatar" :class="`is-${a.status}`">{{ a.avatar }}</div>
              <div class="name-info">
                <div class="name-text">{{ a.name }}</div>
                <div class="desc-text">{{ a.description }}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="role-tag">{{ a.role }}</span>
          </td>
          <td>
            <span class="status-pill" :class="`is-${a.status}`">
              <span class="status-dot" :class="`status-dot--${a.status}`"></span>
              {{ a.status === 'enabled' ? '启用' : '停用' }}
            </span>
          </td>
          <td>
            <span class="memory-tag">{{
              a.memoryType === 'short' ? '短期' :
              a.memoryType === 'mem0ai' ? 'mem0ai' :
              a.memoryType === 'powermem' ? 'PowerMem' : '无'
            }}</span>
          </td>
          <td>
            <span v-if="a.voiceprintEnabled" class="badge-on">已启用</span>
            <span v-else class="badge-off">未启用</span>
          </td>
          <td class="num-cell">{{ a.callsToday.toLocaleString('zh-CN') }}</td>
          <td class="num-cell">{{ a.callsTotal.toLocaleString('zh-CN') }}</td>
          <td class="muted">{{ a.updatedAt }}</td>
          <td class="td-actions">
            <div class="menu-wrap">
              <button class="menu-btn" @click.stop="toggleMenu(a.id, $event)">
                <MoreHorizontal :size="16" />
              </button>
              <div v-if="menuOpen === a.id" class="menu" @click.stop>
                  <button class="menu-item" @click="editAgent(a, $event)">
                    <Edit3 :size="14" />
                    <span>编辑</span>
                  </button>
                  <button class="menu-item" @click="viewChat(a)">
                    <MessageSquare :size="14" />
                    <span>对话历史</span>
                  </button>
                  <button class="menu-item" @click="viewStats(a, $event)">
                    <BarChart3 :size="14" />
                    <span>调用统计</span>
                  </button>
                  <div class="menu-divider"></div>
                  <button class="menu-item" @click="toggleAgent(a, $event)">
                    <Power :size="14" />
                    <span>{{ a.status === 'enabled' ? '停用' : '启用' }}</span>
                  </button>
                  <button class="menu-item menu-item--danger" @click="confirmDelete(a, $event)">
                    <Trash2 :size="14" />
                    <span>删除</span>
                  </button>
                </div>
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

.agent-table {
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
  white-space: nowrap;

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
  max-width: 280px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;

  &.is-disabled {
    background: var(--color-bg-page);
    opacity: 0.6;
  }
}

.name-info {
  min-width: 0;
}

.name-text {
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
  margin-bottom: 2px;
}

.desc-text {
  font-size: 12px;
  color: var(--color-text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.role-tag {
  display: inline-block;
  padding: 2px 10px;
  background: var(--color-bg-page);
  color: var(--color-text-secondary);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;

  &.is-enabled {
    background: var(--color-success-light);
    color: var(--color-success);
  }
  &.is-disabled {
    background: var(--color-bg-page);
    color: var(--color-text-tertiary);
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot--enabled {
  background: var(--color-success);
}
.status-dot--disabled {
  background: var(--color-text-tertiary);
}

.memory-tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-on {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-success-light);
  color: var(--color-success);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-off {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-bg-page);
  color: var(--color-text-tertiary);
  border-radius: 4px;
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
