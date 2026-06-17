<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, ChevronDown, ScanLine } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { mockAgentNames, mockDeviceModels, mockRooms, mockWakeWords } from './mockData'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: any): void
}>()

const toast = useToast()

const form = reactive({
  mac: '',
  name: '',
  room: '客厅',
  wifiSsid: 'Xiaozhi-Home',
  wifiPassword: '',
  mqttEnabled: true,
  mqttAddress: 'tcp://192.168.1.10:1883',
  defaultAgent: '标准小智',
  backupAgents: [] as string[],
  voiceprintEnabled: false,
  wakeWord: '你好小智',
  volume: 50,
  showAdvanced: false
})

const errors = reactive<{ mac?: string; name?: string; wifiPassword?: string }>({})

const macPlaceholder = computed(() => '11:22:33:44:55:66')

function validateMac(mac: string) {
  return /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/.test(mac)
}

function validate() {
  errors.mac = undefined
  errors.name = undefined
  errors.wifiPassword = undefined

  if (!form.mac) {
    errors.mac = '请输入 MAC 地址'
    return false
  }
  if (!validateMac(form.mac)) {
    errors.mac = 'MAC 格式不正确(示例: 11:22:33:44:55:66)'
    return false
  }
  if (!form.name) {
    errors.name = '请输入设备名称'
    return false
  }
  if (!form.wifiSsid) {
    toast.error('请填写 WiFi SSID')
    return false
  }
  return true
}

function close() {
  emit('update:modelValue', false)
  reset()
}

function reset() {
  form.mac = ''
  form.name = ''
  form.room = '客厅'
  form.wifiSsid = 'Xiaozhi-Home'
  form.wifiPassword = ''
  form.defaultAgent = '标准小智'
  form.backupAgents = []
  form.voiceprintEnabled = false
  form.wakeWord = '你好小智'
  form.volume = 50
  form.showAdvanced = false
  errors.mac = undefined
  errors.name = undefined
}

function submit() {
  if (!validate()) return
  emit('submit', { ...form })
  toast.success('设备已添加(Phase 6 接真实 API)')
  close()
}

function scanQrcode() {
  toast.info('扫码功能 Phase 4 实装(ZXing)')
  form.mac = '11:22:33:44:55:88'
}

function addBackupAgent() {
  if (form.backupAgents.length >= 2) {
    toast.warning('最多添加 2 个备选智能体')
    return
  }
  form.backupAgents.push('')
}

function removeBackupAgent(index: number) {
  form.backupAgents.splice(index, 1)
}

defineExpose({ reset })
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue" class="drawer-mask" @click.self="close">
        <div class="drawer">
          <header class="drawer-header">
            <h2 class="drawer-title">添加设备</h2>
            <button class="close-btn" @click="close" aria-label="关闭">
              <X :size="18" />
            </button>
          </header>

          <div class="drawer-body">
            <!-- 1. 基本信息 -->
            <section class="form-section">
              <header class="section-header">
                <h3 class="section-title">基本信息</h3>
              </header>
              <div class="form-row">
                <label class="form-label">设备 MAC *</label>
                <div class="input-wrap" :class="{ 'has-error': errors.mac }">
                  <input
                    v-model="form.mac"
                    type="text"
                    class="form-input"
                    :placeholder="macPlaceholder"
                  />
                  <button type="button" class="suffix-btn" @click="scanQrcode" aria-label="扫码">
                    <ScanLine :size="14" />
                    <span>扫码</span>
                  </button>
                </div>
                <span v-if="errors.mac" class="error-msg">{{ errors.mac }}</span>
              </div>
              <div class="form-row">
                <label class="form-label">设备名称 *</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  :class="{ 'has-error': errors.name }"
                  placeholder="例如:客厅音箱-01"
                />
                <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
              </div>
              <div class="form-row">
                <label class="form-label">所在房间</label>
                <div class="select-wrap">
                  <select v-model="form.room" class="form-select">
                    <option v-for="r in mockRooms" :key="r" :value="r">{{ r }}</option>
                  </select>
                  <ChevronDown :size="14" class="select-icon" />
                </div>
              </div>
            </section>

            <!-- 2. 网络配置 -->
            <section class="form-section">
              <header class="section-header">
                <h3 class="section-title">网络配置</h3>
              </header>
              <div class="form-row">
                <label class="form-label">WiFi SSID</label>
                <input
                  v-model="form.wifiSsid"
                  type="text"
                  class="form-input"
                  placeholder="WiFi 名称"
                />
              </div>
              <div class="form-row">
                <label class="form-label">WiFi 密码</label>
                <input
                  v-model="form.wifiPassword"
                  type="password"
                  class="form-input"
                  placeholder="留空表示开放网络"
                />
              </div>
              <div class="form-row form-row--checkbox">
                <label class="checkbox">
                  <input v-model="form.mqttEnabled" type="checkbox" />
                  <span>启用 MQTT 接入</span>
                </label>
              </div>
              <div v-if="form.mqttEnabled" class="form-row">
                <label class="form-label">MQTT 地址</label>
                <input
                  v-model="form.mqttAddress"
                  type="text"
                  class="form-input"
                  placeholder="tcp://host:port"
                />
              </div>
            </section>

            <!-- 3. 智能体分配 -->
            <section class="form-section">
              <header class="section-header">
                <h3 class="section-title">智能体分配</h3>
              </header>
              <div class="form-row">
                <label class="form-label">默认智能体</label>
                <div class="select-wrap">
                  <select v-model="form.defaultAgent" class="form-select">
                    <option v-for="a in mockAgentNames" :key="a" :value="a">{{ a }}</option>
                  </select>
                  <ChevronDown :size="14" class="select-icon" />
                </div>
              </div>
              <div class="form-row">
                <label class="form-label">备选智能体</label>
                <div class="backup-list">
                  <div v-for="(agent, i) in form.backupAgents" :key="i" class="backup-item">
                    <select v-model="form.backupAgents[i]" class="form-select">
                      <option value="">请选择</option>
                      <option v-for="a in mockAgentNames" :key="a" :value="a">{{ a }}</option>
                    </select>
                    <button class="remove-btn" @click="removeBackupAgent(i)">移除</button>
                  </div>
                  <button v-if="form.backupAgents.length < 2" class="add-btn" @click="addBackupAgent">
                    + 添加备选
                  </button>
                </div>
              </div>
              <div class="form-row form-row--checkbox">
                <label class="checkbox">
                  <input v-model="form.voiceprintEnabled" type="checkbox" />
                  <span>启用声纹识别(需要先注册声纹)</span>
                </label>
              </div>
            </section>

            <!-- 4. 高级(默认折叠) -->
            <section class="form-section">
              <header class="section-header section-header--toggle" @click="form.showAdvanced = !form.showAdvanced">
                <h3 class="section-title">高级</h3>
                <ChevronDown
                  :size="16"
                  class="toggle-icon"
                  :class="{ 'is-open': form.showAdvanced }"
                />
              </header>
              <template v-if="form.showAdvanced">
                <div class="form-row">
                  <label class="form-label">唤醒词</label>
                  <div class="select-wrap">
                    <select v-model="form.wakeWord" class="form-select">
                      <option v-for="w in mockWakeWords" :key="w" :value="w">{{ w }}</option>
                    </select>
                    <ChevronDown :size="14" class="select-icon" />
                  </div>
                </div>
                <div class="form-row">
                  <label class="form-label">初始音量 {{ form.volume }}%</label>
                  <input
                    v-model.number="form.volume"
                    type="range"
                    min="0"
                    max="100"
                    class="form-range"
                  />
                </div>
              </template>
            </section>
          </div>

          <footer class="drawer-footer">
            <button class="btn btn-secondary" @click="close">取消</button>
            <button class="btn btn-primary" @click="submit">添加设备</button>
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
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-divider);
  flex-shrink: 0;
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
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

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px 24px;
}

.form-section {
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 12px;
}

.section-header--toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.toggle-icon {
  color: var(--color-text-tertiary);
  transition: transform 200ms var(--ease-standard);

  &.is-open {
    transform: rotate(180deg);
  }
}

.form-row {
  margin-bottom: 12px;

  &--checkbox {
    margin-top: 4px;
  }
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.input-wrap {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  overflow: hidden;
  transition: all 120ms var(--ease-standard);

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
  }

  &.has-error {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px var(--color-danger-light);
  }
}

.form-input {
  flex: 1;
  border: 0;
  background: transparent;
  padding: 0 12px;
  height: 40px;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;

  &::placeholder {
    color: var(--color-text-tertiary);
  }
}

.input-wrap .form-input {
  border-radius: 0;
}

.suffix-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
  border-left: 1px solid var(--color-border);
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-primary-light-2);
  }
}

.select-wrap {
  position: relative;
}

.form-select {
  width: 100%;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  padding: 0 32px 0 12px;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 120ms var(--ease-standard);

  &:focus {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
  }
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.error-msg {
  display: block;
  font-size: 12px;
  color: var(--color-danger);
  margin-top: 4px;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 14px;

  input {
    accent-color: var(--color-primary);
  }
}

.backup-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.backup-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-btn {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-danger);
  background: var(--color-bg-page);
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-danger-light);
  }
}

.add-btn {
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-primary);
  background: var(--color-primary-light);
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-primary-light-2);
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
    box-shadow: 0 2px 4px rgba(79, 107, 255, 0.3);
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
  transition: all 120ms var(--ease-standard);
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
    border-color: var(--color-primary-hover);
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
