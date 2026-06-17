<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { X, ChevronDown, Sparkles } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { mockCategories, mockVoices, mockMemoryTypes, mockTemplates, type Agent } from './mockData'

const props = defineProps<{
  modelValue: boolean
  agent?: Agent | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: Agent): void
}>()

const toast = useToast()

const isEdit = computed(() => !!props.agent)

const form = reactive<Partial<Agent>>({
  name: '',
  avatar: '🤖',
  role: '通用',
  description: '',
  systemPrompt: '',
  status: 'enabled',
  category: 'general',
  knowledgeBaseIds: [],
  tools: [],
  ttsVoice: 'zh_female_温柔',
  ttsSpeed: 1.0,
  ttsPitch: 1.0,
  memoryType: 'short',
  voiceprintEnabled: false
})

const showAdvanced = ref(false)
const showTemplatePanel = ref(false)
const newToolName = ref('')

const errors = reactive<{ name?: string; systemPrompt?: string }>({})

function reset() {
  if (props.agent) {
    Object.assign(form, props.agent)
  } else {
    form.name = ''
    form.avatar = '🤖'
    form.role = '通用'
    form.description = ''
    form.systemPrompt = ''
    form.status = 'enabled'
    form.category = 'general'
    form.knowledgeBaseIds = []
    form.tools = []
    form.ttsVoice = 'zh_female_温柔'
    form.ttsSpeed = 1.0
    form.ttsPitch = 1.0
    form.memoryType = 'short'
    form.voiceprintEnabled = false
  }
  errors.name = undefined
  errors.systemPrompt = undefined
  showAdvanced.value = false
  showTemplatePanel.value = false
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) reset()
  }
)

function close() {
  emit('update:modelValue', false)
}

function validate() {
  errors.name = undefined
  errors.systemPrompt = undefined
  if (!form.name?.trim()) {
    errors.name = '请输入智能体名称'
    return false
  }
  if (!form.systemPrompt?.trim() || (form.systemPrompt?.trim().length || 0) < 10) {
    errors.systemPrompt = '系统提示词至少 10 个字符'
    return false
  }
  return true
}

function submit() {
  if (!validate()) return
  emit('submit', {
    id: props.agent?.id || ('a' + Date.now()),
    name: form.name!,
    avatar: form.avatar || '🤖',
    role: form.role!,
    description: form.description || '',
    systemPrompt: form.systemPrompt!,
    status: form.status as 'enabled' | 'disabled',
    category: form.category as Agent['category'],
    knowledgeBaseIds: form.knowledgeBaseIds || [],
    tools: form.tools || [],
    ttsVoice: form.ttsVoice!,
    ttsSpeed: form.ttsSpeed || 1.0,
    ttsPitch: form.ttsPitch || 1.0,
    memoryType: form.memoryType as Agent['memoryType'],
    voiceprintEnabled: !!form.voiceprintEnabled,
    callsToday: props.agent?.callsToday || 0,
    callsTotal: props.agent?.callsTotal || 0,
    createdAt: props.agent?.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  })
  toast.success(isEdit.value ? '智能体已更新' : '智能体已创建')
  close()
}

function useTemplate(t: typeof mockTemplates[0]) {
  form.category = t.category as Agent['category']
  form.description = t.description
  form.systemPrompt = `你是${t.name},负责${t.description}。请用专业友好的语气与用户交流。`
  form.role = t.category
  showTemplatePanel.value = false
  toast.info(`已应用模板: ${t.name}`)
}

function addTool() {
  if (!newToolName.value.trim()) return
  if (form.tools!.length >= 5) {
    toast.warning('最多添加 5 个工具')
    return
  }
  form.tools!.push(newToolName.value.trim())
  newToolName.value = ''
}

function removeTool(idx: number) {
  form.tools!.splice(idx, 1)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue" class="drawer-mask" @click.self="close">
        <div class="drawer">
          <header class="drawer-header">
            <h2 class="drawer-title">
              {{ isEdit ? '编辑智能体' : '新建智能体' }}
            </h2>
            <button class="close-btn" @click="close" aria-label="关闭">
              <X :size="18" />
            </button>
          </header>

          <div class="drawer-body">
            <!-- 模板市场(只在新建时显示) -->
            <section v-if="!isEdit" class="form-section">
              <button
                class="template-toggle"
                @click="showTemplatePanel = !showTemplatePanel"
              >
                <Sparkles :size="14" />
                <span>从模板快速创建</span>
                <ChevronDown
                  :size="14"
                  class="toggle-icon"
                  :class="{ 'is-open': showTemplatePanel }"
                />
              </button>
              <Transition name="expand">
                <div v-if="showTemplatePanel" class="template-grid">
                  <button
                    v-for="t in mockTemplates"
                    :key="t.id"
                    class="template-card"
                    @click="useTemplate(t)"
                  >
                    <div class="template-icon">{{ t.icon }}</div>
                    <div class="template-info">
                      <div class="template-name">{{ t.name }}</div>
                      <div class="template-desc">{{ t.description }}</div>
                    </div>
                  </button>
                </div>
              </Transition>
            </section>

            <!-- 1. 基础信息 -->
            <section class="form-section">
              <header class="section-header">
                <h3 class="section-title">基础信息</h3>
              </header>
              <div class="form-row">
                <label class="form-label">头像</label>
                <div class="avatar-picker">
                  <input
                    v-model="form.avatar"
                    type="text"
                    class="form-input"
                    style="width: 80px;"
                    maxlength="2"
                  />
                  <span class="hint">支持 emoji 或单个字符</span>
                </div>
              </div>
              <div class="form-row">
                <label class="form-label">智能体名称 *</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  :class="{ 'has-error': errors.name }"
                  placeholder="例如:标准小智"
                />
                <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
              </div>
              <div class="form-row">
                <label class="form-label">角色</label>
                <input
                  v-model="form.role"
                  type="text"
                  class="form-input"
                  placeholder="例如:通用对话 / 厨房助手"
                />
              </div>
              <div class="form-row">
                <label class="form-label">分类</label>
                <div class="select-wrap">
                  <select v-model="form.category" class="form-select">
                    <option v-for="c in mockCategories" :key="c.value" :value="c.value">{{ c.label }}</option>
                  </select>
                  <ChevronDown :size="14" class="select-icon" />
                </div>
              </div>
              <div class="form-row">
                <label class="form-label">描述</label>
                <textarea
                  v-model="form.description"
                  class="form-textarea"
                  placeholder="一句话描述这个智能体的能力"
                  rows="2"
                ></textarea>
              </div>
            </section>

            <!-- 2. 系统提示词 -->
            <section class="form-section">
              <header class="section-header">
                <h3 class="section-title">系统提示词</h3>
              </header>
              <div class="form-row">
                <textarea
                  v-model="form.systemPrompt"
                  class="form-textarea form-textarea--tall"
                  :class="{ 'has-error': errors.systemPrompt }"
                  placeholder="定义智能体的性格、知识范围、行为准则等(至少 10 字符)"
                  rows="6"
                ></textarea>
                <span v-if="errors.systemPrompt" class="error-msg">{{ errors.systemPrompt }}</span>
                <span v-else class="hint">{{ form.systemPrompt?.length || 0 }} 字符</span>
              </div>
            </section>

            <!-- 3. 知识库 + 工具 -->
            <section class="form-section">
              <header class="section-header">
                <h3 class="section-title">知识库与工具</h3>
              </header>
              <div class="form-row">
                <label class="form-label">关联知识库</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="输入知识库 ID,逗号分隔"
                  :value="(form.knowledgeBaseIds || []).join(', ')"
                  @input="(e) => {
                    const val = (e.target as HTMLInputElement).value
                    form.knowledgeBaseIds = val.split(',').map(s => s.trim()).filter(Boolean)
                  }"
                />
                <span class="hint">Phase 6 接入真实知识库,现在用占位</span>
              </div>
              <div class="form-row">
                <label class="form-label">可用工具</label>
                <div class="tools-list">
                  <div v-for="(t, i) in form.tools" :key="i" class="tool-chip">
                    <code>{{ t }}</code>
                    <button class="chip-remove" @click="removeTool(i)">×</button>
                  </div>
                  <div class="tool-add">
                    <input
                      v-model="newToolName"
                      type="text"
                      class="form-input"
                      placeholder="工具名,如 weather"
                      @keyup.enter="addTool"
                    />
                    <button class="add-btn" @click="addTool">+ 添加</button>
                  </div>
                </div>
              </div>
            </section>

            <!-- 4. 高级(声音/记忆/声纹) -->
            <section class="form-section">
              <header class="section-header section-header--toggle" @click="showAdvanced = !showAdvanced">
                <h3 class="section-title">高级(声音 / 记忆 / 声纹)</h3>
                <ChevronDown
                  :size="16"
                  class="toggle-icon"
                  :class="{ 'is-open': showAdvanced }"
                />
              </header>
              <template v-if="showAdvanced">
                <div class="form-row">
                  <label class="form-label">TTS 音色</label>
                  <div class="select-wrap">
                    <select v-model="form.ttsVoice" class="form-select">
                      <option v-for="v in mockVoices" :key="v.value" :value="v.value">{{ v.label }}</option>
                    </select>
                    <ChevronDown :size="14" class="select-icon" />
                  </div>
                </div>
                <div class="form-row form-row--double">
                  <div>
                    <label class="form-label">语速 {{ form.ttsSpeed?.toFixed(1) }}</label>
                    <input
                      v-model.number="form.ttsSpeed"
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      class="form-range"
                    />
                  </div>
                  <div>
                    <label class="form-label">音调 {{ form.ttsPitch?.toFixed(1) }}</label>
                    <input
                      v-model.number="form.ttsPitch"
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      class="form-range"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <label class="form-label">记忆类型</label>
                  <div class="select-wrap">
                    <select v-model="form.memoryType" class="form-select">
                      <option v-for="m in mockMemoryTypes" :key="m.value" :value="m.value">{{ m.label }}</option>
                    </select>
                    <ChevronDown :size="14" class="select-icon" />
                  </div>
                </div>
                <div class="form-row form-row--checkbox">
                  <label class="checkbox">
                    <input v-model="form.voiceprintEnabled" type="checkbox" />
                    <span>启用声纹识别(需要先注册声纹)</span>
                  </label>
                </div>
              </template>
            </section>

            <!-- 5. 状态 -->
            <section class="form-section">
              <div class="form-row form-row--checkbox">
                <label class="checkbox">
                  <input
                    type="checkbox"
                    :checked="form.status === 'enabled'"
                    @change="(e) => form.status = (e.target as HTMLInputElement).checked ? 'enabled' : 'disabled'"
                  />
                  <span>启用此智能体</span>
                </label>
              </div>
            </section>
          </div>

          <footer class="drawer-footer">
            <button class="btn btn-secondary" @click="close">取消</button>
            <button class="btn btn-primary" @click="submit">
              {{ isEdit ? '保存修改' : '创建智能体' }}
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

  &--double {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-input {
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

  &.has-error {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px var(--color-danger-light);
  }
}

.form-textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  padding: 10px 12px;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  resize: vertical;
  font-family: var(--font-sans);
  line-height: 1.5;
  transition: all 120ms var(--ease-standard);

  &:focus {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
  }

  &.has-error {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 3px var(--color-danger-light);
  }

  &--tall {
    min-height: 120px;
    font-family: var(--font-mono);
    font-size: 13px;
  }
}

.avatar-picker {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 4px;
  display: block;
}

.error-msg {
  font-size: 12px;
  color: var(--color-danger);
  margin-top: 4px;
  display: block;
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

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 4px 4px 10px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  width: fit-content;

  code {
    font-family: var(--font-mono);
  }
}

.chip-remove {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  color: var(--color-primary);
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-primary);
    color: white;
  }
}

.tool-add {
  display: flex;
  gap: 8px;
}

.add-btn {
  padding: 0 12px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background: var(--color-primary-hover);
  }
}

.template-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px 14px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-accent);
    color: white;
  }

  .toggle-icon {
    margin-left: auto;
  }
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.template-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--color-bg-page);
  border-radius: var(--radius-sm);
  text-align: left;
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-primary-light);
  }
}

.template-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.template-desc {
  font-size: 11px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
  line-height: 1.3;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 200ms var(--ease-standard);
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 400px;
  opacity: 1;
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
