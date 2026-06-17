<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Cpu, Bot, Wifi, RefreshCw, Activity, Copy } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { maskMac } from '@/utils/format'
import LiveStream from '@/components/dashboard/LiveStream.vue'
import type { Device } from './mockData'
import { mockAgentNames, mockWakeWords } from './mockData'

const props = defineProps<{
  modelValue: boolean
  device: Device | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', payload: Device): void
}>()

const toast = useToast()
const activeTab = ref<'basic' | 'agent' | 'network' | 'ota' | 'log'>('basic')

const editForm = ref<Device | null>(null)

watch(
  () => props.device,
  (d) => {
    if (d) editForm.value = { ...d }
  },
  { immediate: true }
)

const tabs = [
  { key: 'basic' as const, label: '基础', icon: Cpu },
  { key: 'agent' as const, label: '智能体', icon: Bot },
  { key: 'network' as const, label: '网络', icon: Wifi },
  { key: 'ota' as const, label: 'OTA', icon: RefreshCw },
  { key: 'log' as const, label: '日志', icon: Activity }
]

function close() {
  emit('update:modelValue', false)
}

function save() {
  if (editForm.value) {
    emit('save', { ...editForm.value })
    toast.success('设置已保存(Phase 6 接真实 API)')
    close()
  }
}

function copy(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('已复制')
}

const deviceStatusLabel = computed(() => {
  if (!editForm.value) return ''
  const map = { online: '在线', offline: '离线', error: '故障' }
  return map[editForm.value.status]
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue && editForm" class="drawer-mask" @click.self="close">
        <div class="drawer">
          <header class="drawer-header">
            <div class="header-main">
              <div class="device-icon">
                <Cpu :size="20" />
              </div>
              <div class="header-info">
                <h2 class="header-title">{{ editForm.name }}</h2>
                <div class="header-meta">
                  <span class="status-pill" :class="`is-${editForm.status}`">
                    <span class="status-dot" :class="`status-dot--${editForm.status}`"></span>
                    {{ deviceStatusLabel }}
                  </span>
                  <span class="meta-text">{{ editForm.model }}</span>
                  <code class="meta-mac" @click="copy(editForm.mac)">
                    {{ editForm.mac }}
                    <Copy :size="10" />
                  </code>
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
              <div class="form-row">
                <label class="form-label">设备名称</label>
                <input v-model="editForm.name" type="text" class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">所在房间</label>
                <input v-model="editForm.room" type="text" class="form-input" />
              </div>
              <div class="form-row">
                <label class="form-label">唤醒词</label>
                <select v-model="editForm.wakeWord" class="form-select">
                  <option v-for="w in mockWakeWords" :key="w" :value="w">{{ w }}</option>
                </select>
              </div>
              <div class="form-row">
                <label class="form-label">音量 {{ editForm.volume }}%</label>
                <input
                  v-model.number="editForm.volume"
                  type="range"
                  min="0"
                  max="100"
                  class="form-range"
                />
              </div>
            </section>

            <!-- 智能体 -->
            <section v-else-if="activeTab === 'agent'" class="form-section">
              <div class="form-row">
                <label class="form-label">默认智能体</label>
                <select v-model="editForm.agent" class="form-select">
                  <option v-for="a in mockAgentNames" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>
              <div class="info-block">
                <h4 class="info-title">智能体能力</h4>
                <div class="capability-list">
                  <span class="capability">语音对话</span>
                  <span class="capability">工具调用</span>
                  <span class="capability">流式响应</span>
                  <span class="capability">声纹识别</span>
                </div>
              </div>
            </section>

            <!-- 网络 -->
            <section v-else-if="activeTab === 'network'" class="form-section">
              <div class="form-row">
                <label class="form-label">WiFi SSID</label>
                <input :value="editForm.wifi" type="text" class="form-input" readonly />
              </div>
              <div class="form-row">
                <label class="form-label">IP 地址</label>
                <input :value="editForm.ip" type="text" class="form-input" readonly />
              </div>
              <div class="form-row">
                <label class="form-label">MAC 地址</label>
                <div class="input-with-action">
                  <input :value="editForm.mac" type="text" class="form-input" readonly />
                  <button class="action-btn" @click="copy(editForm.mac)">
                    <Copy :size="14" />
                  </button>
                </div>
              </div>
              <div class="form-row">
                <label class="form-label">信号强度</label>
                <div class="signal-bar">
                  <div class="signal-fill" :class="`is-${editForm.signal}`" :style="{ width: signalWidth }"></div>
                </div>
                <div class="signal-text">{{ editForm.signal === 'offline' ? '无信号' : editForm.signal === 'weak' ? '弱' : editForm.signal === 'medium' ? '中' : '强' }}</div>
              </div>
            </section>

            <!-- OTA -->
            <section v-else-if="activeTab === 'ota'" class="form-section">
              <div class="info-block">
                <h4 class="info-title">当前固件</h4>
                <div class="firmware-info">
                  <code>{{ editForm.firmware }}</code>
                  <span class="badge">已是最新</span>
                </div>
              </div>
              <button class="action-button" @click="toast.info('检测更新功能 Phase 4 实装')">
                <RefreshCw :size="14" />
                <span>检查更新</span>
              </button>
              <button class="action-button" @click="toast.info('重启功能 Phase 4 实装')">
                <Cpu :size="14" />
                <span>重启设备</span>
              </button>
            </section>

            <!-- 日志 -->
            <section v-else-if="activeTab === 'log'" class="form-section form-section--log">
              <LiveStream :source="'device'" :device-id="editForm.id" />
            </section>
          </div>

          <footer class="drawer-footer">
            <button class="btn btn-secondary" @click="close">取消</button>
            <button v-if="activeTab !== 'log'" class="btn btn-primary" @click="save">保存修改</button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
const signalWidthMap = { offline: '0%', weak: '25%', medium: '60%', strong: '100%' }
export default {
  computed: {
    signalWidth(): string {
      return signalWidthMap[(this as any).editForm?.signal] || '0%'
    }
  }
}
</script>

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

.device-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  color: var(--color-text-tertiary);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  background: var(--color-bg-page);

  &.is-online {
    background: var(--color-success-light);
    color: var(--color-success);
  }
  &.is-error {
    background: var(--color-danger-light);
    color: var(--color-danger);
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot--online {
  background: var(--color-success);
}
.status-dot--offline {
  background: var(--color-text-tertiary);
}
.status-dot--error {
  background: var(--color-danger);
}

.meta-text {
  color: var(--color-text-secondary);
}

.meta-mac {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  padding: 2px 6px;
  background: var(--color-bg-page);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    color: var(--color-text-primary);
  }
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
  &--log {
    height: 100%;
    margin: -24px;
    padding: 24px;
  }
}

.form-row {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-input,
.form-select {
  width: 100%;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  transition: all 120ms var(--ease-standard);

  &:focus {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
  }

  &:read-only {
    background: var(--color-bg-page);
    color: var(--color-text-secondary);
    cursor: default;
  }
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239AA3B5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  cursor: pointer;
}

.input-with-action {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.action-btn {
  width: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);

  &:hover {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
}

.form-range {
  width: 100%;
  height: 4px;
  appearance: none;
  background: var(--color-border);
  border-radius: 9999px;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
  }
}

.info-block {
  background: var(--color-bg-page);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 16px;
}

.info-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 8px;
}

.capability-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.capability {
  padding: 3px 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.firmware-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 14px;

  code {
    font-weight: 600;
  }
}

.badge {
  padding: 2px 8px;
  background: var(--color-success-light);
  color: var(--color-success);
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font-sans);
}

.signal-bar {
  width: 100%;
  height: 6px;
  background: var(--color-border);
  border-radius: 9999px;
  overflow: hidden;
}

.signal-fill {
  height: 100%;
  background: var(--color-success);
  border-radius: 9999px;
  transition: width 200ms var(--ease-standard);

  &.is-weak {
    background: var(--color-warning);
  }
  &.is-medium {
    background: var(--color-info);
  }
  &.is-offline {
    background: var(--color-text-tertiary);
  }
}

.signal-text {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 4px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  font-size: 14px;
  margin-bottom: 8px;
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-bg-page);
    border-color: var(--color-primary);
    color: var(--color-primary);
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
