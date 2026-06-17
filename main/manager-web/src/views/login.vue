<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Sparkles, Eye, EyeOff, LogIn } from 'lucide-vue-next'
import { ElInput, ElCheckbox, ElButton } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useConfigStore } from '@/stores/config'
import { useToast } from '@/composables/useToast'
import { useBreakpoint } from '@/composables/useBreakpoint'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const config = useConfigStore()
const toast = useToast()
const { isMobile } = useBreakpoint()

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const submitting = ref(false)
const errors = reactive<{ username?: string; password?: string }>({})

function validate() {
  errors.username = undefined
  errors.password = undefined
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    return false
  }
  if (!form.password) {
    errors.password = '请输入密码'
    return false
  }
  if (form.password.length < 6) {
    errors.password = '密码至少 6 位'
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const result: any = await auth.login({ username: form.username, password: form.password })
    const sourceLabel = result.source === 'mock' ? ' (Mock 模式)' : ''
    toast.success(`欢迎回来,${auth.username || form.username}${sourceLabel}`)
    const redirect = (route.query.redirect as string) || '/home'
    router.push(redirect)
  } catch (e: any) {
    toast.error(e.message || '登录失败')
  } finally {
    submitting.value = false
  }
}

function goRegister() {
  router.push('/register')
}

function goRetrieve() {
  router.push('/retrieve-password')
}

onMounted(async () => {
  try {
    await config.fetchPubConfig()
  } catch {
    // 静默
  }
})
</script>

<template>
  <div class="login-page" :class="{ 'is-mobile': isMobile }">
    <div class="brand-side">
      <div class="brand-inner">
        <div class="brand-logo">
          <Sparkles :size="32" class="sparkle" />
        </div>
        <h1 class="brand-title">小智智控台</h1>
        <p class="brand-tagline">智能硬件管理中心</p>

        <ul class="features">
          <li>· 实时设备状态监控</li>
          <li>· 多智能体协同管理</li>
          <li>· 声纹识别与知识库</li>
          <li>· 流式 ASR / TTS 配置</li>
        </ul>
      </div>
    </div>

    <div class="form-side">
      <div class="form-wrap">
        <div class="form-header">
          <h2 class="form-title">登录</h2>
          <p class="form-subtitle">使用您的账号继续</p>
        </div>

        <form class="form" @submit.prevent="handleSubmit">
          <div class="field">
            <label class="label" for="username">用户名</label>
            <ElInput
              id="username"
              v-model="form.username"
              size="large"
              placeholder="请输入用户名"
              autocomplete="username"
              :disabled="submitting"
              :status="errors.username ? 'error' : ''"
              clearable
            />
            <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
          </div>

          <div class="field">
            <label class="label" for="password">密码</label>
            <ElInput
              id="password"
              v-model="form.password"
              size="large"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              autocomplete="current-password"
              :disabled="submitting"
              :status="errors.password ? 'error' : ''"
            >
              <template #suffix>
                <button
                  type="button"
                  class="toggle-pwd"
                  :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" :size="16" />
                  <EyeOff v-else :size="16" />
                </button>
              </template>
            </ElInput>
            <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
          </div>

          <div class="row-between">
            <ElCheckbox v-model="form.remember">记住我</ElCheckbox>
            <button type="button" class="link" @click="goRetrieve">忘记密码?</button>
          </div>

          <ElButton
            type="primary"
            size="large"
            native-type="submit"
            class="submit-btn"
            :loading="submitting"
            style="--el-button-bg-color: #4F6BFF; --el-button-border-color: #4F6BFF; --el-button-hover-bg-color: #3A52E0; --el-button-hover-border-color: #3A52E0; --el-button-active-bg-color: #2A3DB8; --el-button-active-border-color: #2A3DB8;"
          >
            <template #loading>
              <span class="loading-content">
                <span class="dot"></span>
                <span>登录中…</span>
              </span>
            </template>
            <span v-if="!submitting" class="btn-content">
              <LogIn :size="16" />
              <span>登录</span>
            </span>
            <span v-else>登录中…</span>
          </ElButton>
        </form>

        <div class="form-footer">
          <span>还没有账号?</span>
          <button class="link" @click="goRegister">立即注册</button>
        </div>

        <p v-if="config.version" class="version">v{{ config.version }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/breakpoints' as *;

.login-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: row;
  background: var(--color-bg-page);
  width: 100%;

  @include mobile {
    flex-direction: column;
  }
}

.brand-side {
  flex: 1;
  background: var(--color-bg-sidebar);
  color: var(--color-text-on-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
  min-width: 0;

  @include mobile {
    min-height: auto;
    padding: 32px 20px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 40%, rgba(79, 107, 255, 0.25), transparent 50%);
  }
}

.brand-inner {
  position: relative;
  max-width: 380px;
}

.brand-logo {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.sparkle {
  color: var(--color-accent);
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.brand-tagline {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 40px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  list-style: none;
  padding: 0;
}

.form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--color-bg-page);
  min-width: 0;

  @include mobile {
    min-height: auto;
    padding: 32px 20px;
  }
}

// Element Plus 局部覆盖(scoped 必须用 :deep)
:deep(.el-input) {
  width: 100% !important;
}

:deep(.el-input__wrapper) {
  background-color: var(--color-bg-surface) !important;
  box-shadow: none !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 8px !important;
  padding: 0 14px !important;
  outline: none !important;
  min-height: 44px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--color-primary) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px rgba(79, 107, 255, 0.12) !important;
}

/* 关键:隐藏 input 原生 outline + box-shadow,避免双框 */
:deep(.el-input__inner) {
  outline: none !important;
  box-shadow: none !important;
  -webkit-appearance: none !important;
  background: transparent !important;
  height: 44px !important;
  line-height: 44px !important;
  font-size: 14px !important;
  color: var(--color-text-primary) !important;
  border: 0 !important;
  padding: 0 !important;
}

:deep(.el-input__inner:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: 0 !important;
}

/* 隐藏 ElInput 内部的 .el-input-box(有些版本有这个嵌套 div) */
:deep(.el-input__box),
:deep(.el-input__box-inner) {
  border: 0 !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 密码眼睛按钮(在 suffix 槽里)— 强制垂直居中 */
:deep(.el-input__suffix) {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
  right: 14px !important;
  top: 0 !important;
}

:deep(.el-input__suffix-inner) {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

:deep(.toggle-pwd) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 32px !important;
  height: 32px !important;
  color: var(--color-text-tertiary) !important;
  background: transparent !important;
  border: 0 !important;
  padding: 0 !important;
  cursor: pointer !important;
}

:deep(.toggle-pwd:hover) {
  color: var(--color-text-primary) !important;
}

:deep(.el-input__inner) {
  color: var(--color-text-primary) !important;
  height: 44px !important;
  line-height: 44px !important;
  font-size: 14px !important;
}

:deep(.el-input__inner::placeholder) {
  color: var(--color-text-tertiary) !important;
}

:deep(.el-checkbox__inner) {
  border-color: var(--color-border-strong) !important;
  background-color: var(--color-bg-surface) !important;
  width: 16px !important;
  height: 16px !important;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
}

:deep(.el-checkbox__inner::after) {
  border-color: #FFFFFF !important;
  left: 4px !important;
  top: 1px !important;
}

:deep(.el-checkbox__label) {
  color: var(--color-text-secondary) !important;
  font-size: 13px !important;
}

.form-wrap {
  width: 100%;
  max-width: 380px;
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 6px;
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.error-msg {
  font-size: 12px;
  color: var(--color-danger);
  margin-top: 2px;
}

.toggle-pwd {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 120ms var(--ease-standard);

  &:hover {
    color: var(--color-text-primary);
  }
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  margin-top: -4px;
}

.link {
  color: var(--color-primary);
  font-size: 13px;
  transition: color 120ms var(--ease-standard);

  &:hover {
    color: var(--color-primary-hover);
  }
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.submit-btn :deep(span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.form-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  justify-content: center;
  gap: 6px;
}

.version {
  margin-top: 24px;
  text-align: center;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
}

/* === 强制覆盖 ElButton 主色(最高优先级) === */
:deep(.submit-btn.el-button) {
  width: 100% !important;
  height: 44px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  margin-top: 8px !important;
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
  color: #FFFFFF !important;
}

:deep(.submit-btn.el-button:hover) {
  background-color: var(--color-primary-hover) !important;
  border-color: var(--color-primary-hover) !important;
}

:deep(.submit-btn.el-button:active) {
  background-color: var(--color-primary-active) !important;
  border-color: var(--color-primary-active) !important;
}

:deep(.submit-btn.el-button:focus-visible) {
  outline: 2px solid var(--color-primary-light-3) !important;
  outline-offset: 2px !important;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.is-mobile {
  .brand-side {
    padding: 32px 20px;
  }

  .brand-title {
    font-size: 24px;
  }

  .brand-tagline {
    margin-bottom: 0;
  }

  .features {
    display: none;
  }

  .form-side {
    padding: 32px 20px;
  }
}
</style>
