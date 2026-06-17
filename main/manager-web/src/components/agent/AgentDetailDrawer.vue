<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Bot, BookOpen, Wrench, AudioLines, Brain, Edit3 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { mockVoices, mockMemoryTypes, type Agent } from './mockData'

const props = defineProps<{
  modelValue: boolean
  agent: Agent | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'edit', agent: Agent): void
  (e: 'toggle', agent: Agent): void
  (e: 'delete', agent: Agent): void
}>()

const toast = useToast()
const activeTab = ref<'basic' | 'knowledge' | 'tools' | 'voice' | 'memory'>('basic')

const tabs = [
  { key: 'basic' as const, label: '基础', icon: Bot },
  { key: 'knowledge' as const, label: '知识库', icon: BookOpen },
  { key: 'tools' as const, label: '工具', icon: Wrench },
  { key: 'voice' as const, label: '声音', icon: AudioLines },
  { key: 'memory' as const, label: '记忆', icon: Brain }
]

const voiceLabel = computed(() => {
  if (!props.agent) return ''
  const v = mockVoices.find((x) => x.value === props.agent!.ttsVoice)
  return v?.label || props.agent.ttsVoice
})

const memoryLabel = computed(() => {
  if (!props.agent) return ''
  const m = mockMemoryTypes.find((x) => x.value === props.agent!.memoryType)
  return m?.label || props.agent.memoryType
})

function close() {
  emit('update:modelValue', false)
}

function edit() {
  if (props.agent) emit('edit', props.agent)
}

function toggleStatus() {
  if (props.agent) emit('toggle', props.agent)
  close()
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('已复制')
}

const callTrend = computed(() => {
  if (!props.agent) return '0%'
  const trend = Math.floor(Math.random() * 30) - 10
  return trend >= 0 ? `+${trend}%` : `${trend}%`
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue && agent" class="drawer-mask" @click.self="close">
        <div class="drawer">
          <header class="drawer-header">
            <div class="header-main">
              <div class="agent-avatar" :class="`is-${agent.status}`">{{ agent.avatar }}</div>
              <div class="header-info">
                <h2 class="header-title">{{ agent.name }}</h2>
                <div class="header-meta">
                  <span class="status-pill" :class="`is-${agent.status}`">
                    <span class="status-dot" :class="`status-dot--${agent.status}`"></span>
                    {{ agent.status === 'enabled' ? '启用' : '停用' }}
                  </span>
                  <span class="meta-text">{{ agent.role }}</span>
                  <span class="meta-text meta-text--muted">累计 {{ agent.callsTotal.toLocaleString('zh-CN') }} 次</span>
                </div>
              </div>
            </div>
            <button class="close-btn" @click="close" aria-label="关闭">
              <X :size="18" />
            </button>
          </header>

          <nav class="drawer-tabs">
            <button
              v-for="t in tabs"
              :key="t.key"
              class="tab"
              :class="{ 'is-active': activeTab === t.key }"
              @click="activeTab = t.key"
            >
              <component :is="t.icon" :size="14" />
              <span>{{ t.label }}</span>
            </button>
          </nav>

          <div class="drawer-body">
            <!-- 基础 -->
            <section v-if="activeTab === 'basic'" class="form-section">
              <div class="info-block">
                <h4 class="info-title">描述</h4>
                <p class="info-text">{{ agent.description || '—' }}</p>
              </div>

              <div class="info-block">
                <h4 class="info-title">系统提示词</h4>
                <p class="info-text info-text--mono">{{ agent.systemPrompt }}</p>
              </div>

              <div class="info-block">
                <h4 class="info-title">今日表现</h4>
                <div class="metric-row">
                  <div class="metric">
                    <div class="metric-value">{{ agent.callsToday.toLocaleString('zh-CN') }}</div>
                    <div class="metric-label">今日调用</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value text-success">{{ callTrend }}</div>
                    <div class="metric-label">较昨日</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">{{ agent.callsTotal.toLocaleString('zh-CN') }}</div>
                    <div class="metric-label">累计调用</div>
                  </div>
                </div>
              </div>

              <div class="info-block">
                <h4 class="info-title">元信息</h4>
                <div class="meta-grid">
                  <div class="meta-item">
                    <span class="meta-label">创建时间</span>
                    <span class="meta-value">{{ agent.createdAt }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">更新时间</span>
                    <span class="meta-value">{{ agent.updatedAt }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">智能体 ID</span>
                    <code class="meta-value" @click="copy(agent.id)">{{ agent.id }}</code>
                  </div>
                </div>
              </div>
            </section>

            <!-- 知识库 -->
            <section v-else-if="activeTab === 'knowledge'" class="form-section">
              <div v-if="agent.knowledgeBaseIds.length === 0" class="empty-block">
                <p>暂未关联任何知识库</p>
                <button class="action-button" @click="edit">
                  <Edit3 :size="14" />
                  <span>去添加</span>
                </button>
              </div>
              <div v-else class="kb-list">
                <div v-for="kb in agent.knowledgeBaseIds" :key="kb" class="kb-card">
                  <BookOpen :size="20" class="kb-icon" />
                  <div class="kb-info">
                    <div class="kb-name">{{ kb }}</div>
                    <div class="kb-meta">已启用 · 实时同步</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 工具 -->
            <section v-else-if="activeTab === 'tools'" class="form-section">
              <div v-if="agent.tools.length === 0" class="empty-block">
                <p>暂未配置任何工具</p>
                <button class="action-button" @click="edit">
                  <Edit3 :size="14" />
                  <span>去添加</span>
                </button>
              </div>
              <div v-else class="tools-grid">
                <div v-for="t in agent.tools" :key="t" class="tool-card">
                  <Wrench :size="18" class="tool-icon" />
                  <div class="tool-name">{{ t }}</div>
                </div>
              </div>
            </section>

            <!-- 声音 -->
            <section v-else-if="activeTab === 'voice'" class="form-section">
              <div class="info-block">
                <h4 class="info-title">TTS 配置</h4>
                <div class="voice-grid">
                  <div class="voice-item">
                    <span class="voice-label">音色</span>
                    <span class="voice-value">{{ voiceLabel }}</span>
                  </div>
                  <div class="voice-item">
                    <span class="voice-label">语速</span>
                    <span class="voice-value">{{ agent.ttsSpeed.toFixed(1) }}x</span>
                  </div>
                  <div class="voice-item">
                    <span class="voice-label">音调</span>
                    <span class="voice-value">{{ agent.ttsPitch.toFixed(1) }}x</span>
                  </div>
                </div>
              </div>

              <div class="info-block">
                <h4 class="info-title">试听</h4>
                <button class="action-button" @click="toast.info('试听功能 Phase 6 实装')">
                  <AudioLines :size="14" />
                  <span>试听音色</span>
                </button>
              </div>
            </section>

            <!-- 记忆 -->
            <section v-else-if="activeTab === 'memory'" class="form-section">
              <div class="info-block">
                <h4 class="info-title">记忆策略</h4>
                <div class="memory-display">
                  <Brain :size="32" class="memory-icon" />
                  <div class="memory-text">
                    <div class="memory-name">{{ memoryLabel }}</div>
                    <div class="memory-desc">
                      {{
                        agent.memoryType === 'short' ? '会话内短期记忆,跨会话不保留' :
                        agent.memoryType === 'mem0ai' ? 'mem0ai 云端记忆,跨设备同步' :
                        agent.memoryType === 'powermem' ? 'PowerMem 智能记忆,语义检索' :
                        '不记忆任何内容,每次对话独立'
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-block">
                <h4 class="info-title">声纹识别</h4>
                <div class="voiceprint-status">
                  <span v-if="agent.voiceprintEnabled" class="status-on">已启用</span>
                  <span v-else class="status-off">未启用</span>
                  <span class="voiceprint-hint">
                    {{
                      agent.voiceprintEnabled
                        ? '可为不同用户生成个性化回答'
                        : '开启后可为不同用户区分个性化回答'
                    }}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <footer class="drawer-footer">
            <button class="btn btn-secondary" @click="close">关闭</button>
            <button class="btn btn-secondary" @click="toggleStatus">
              {{ agent.status === 'enabled' ? '停用' : '启用' }}
            </button>
            <button class="btn btn-primary" @click="edit">
              <Edit3 :size="14" />
              <span>编辑</span>
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 22, 38, 0.4);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: 720px;
  max-width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: var(--color-bg-surface);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  border-top-left-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-lg);

  @media (max-width: 639px) {
    border-radius: 0;
    width: 100%;
  }
}

.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-divider);
  flex-shrink: 0;
  gap: 16px;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.agent-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;

  &.is-disabled {
    opacity: 0.6;
  }
}

.header-info {
  flex: 1;
  min-width: 0;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
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

.status-dot--enabled { background: var(--color-success); }
.status-dot--disabled { background: var(--color-text-tertiary); }

.meta-text {
  color: var(--color-text-secondary);
}

.meta-text--muted {
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: 11px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  flex-shrink: 0;

  &:hover {
    background: var(--color-bg-page);
    color: var(--color-text-primary);
  }
}

.drawer-tabs {
  display: flex;
  gap: 2px;
  padding: 8px 24px 0;
  border-bottom: 1px solid var(--color-divider);
  flex-shrink: 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  white-space: nowrap;
  transition: all 120ms var(--ease-standard);

  &:hover {
    color: var(--color-text-primary);
  }

  &.is-active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-block {
  background: var(--color-bg-page);
  border-radius: var(--radius-sm);
  padding: 16px;
}

.info-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 8px;
}

.info-text {
  font-size: 14px;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.6;

  &--mono {
    font-family: var(--font-mono);
    font-size: 13px;
    white-space: pre-wrap;
  }
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric {
  text-align: center;

  .metric-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-primary);
    font-family: var(--font-sans);
  }

  .metric-label {
    font-size: 11px;
    color: var(--color-text-tertiary);
    margin-top: 2px;
  }
}

.text-success {
  color: var(--color-success) !important;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.meta-value {
  font-size: 13px;
  color: var(--color-text-primary);
  font-family: var(--font-mono);

  &.code {
    cursor: pointer;
  }
}

.kb-list,
.tools-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.kb-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--color-bg-page);
  border-radius: var(--radius-sm);

  .kb-icon {
    color: var(--color-primary);
    flex-shrink: 0;
  }
}

.kb-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.kb-meta {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

.tool-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);

  .tool-icon {
    flex-shrink: 0;
  }

  .tool-name {
    font-size: 13px;
    font-weight: 600;
    font-family: var(--font-mono);
  }
}

.voice-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.voice-item {
  text-align: center;
  padding: 12px 8px;
  background: var(--color-bg-surface);
  border-radius: var(--radius-sm);

  .voice-label {
    font-size: 11px;
    color: var(--color-text-tertiary);
  }

  .voice-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-top: 4px;
  }
}

.memory-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.memory-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.memory-text {
  flex: 1;
}

.memory-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.memory-desc {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 4px;
}

.voiceprint-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-on {
  padding: 2px 8px;
  background: var(--color-success-light);
  color: var(--color-success);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-off {
  padding: 2px 8px;
  background: var(--color-bg-page);
  color: var(--color-text-tertiary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.voiceprint-hint {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.empty-block {
  text-align: center;
  padding: 48px 16px;
  color: var(--color-text-tertiary);

  p {
    margin: 0 0 16px;
    font-size: 14px;
  }
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  font-size: 13px;
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
}

.drawer-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 24px;
  border-top: 1px solid var(--color-divider);
  background: var(--color-bg-page);
  flex-shrink: 0;
}

.btn {
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-secondary {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);

  &:hover {
    background: var(--color-bg-page);
  }
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);

  &:hover {
    background: var(--color-primary-hover);
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 240ms var(--ease-standard);
}
.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 240ms var(--ease-standard);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}
</style>
