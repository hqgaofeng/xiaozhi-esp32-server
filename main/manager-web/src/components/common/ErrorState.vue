<script setup lang="ts">
import { AlertCircle, RefreshCw } from 'lucide-vue-next'

defineProps<{
  title?: string
  description?: string
  showRetry?: boolean
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="error">
    <AlertCircle :size="64" class="error-icon" />
    <h3 v-if="title" class="error-title">{{ title || '出错了' }}</h3>
    <p v-if="description" class="error-desc">{{ description }}</p>
    <button v-if="showRetry" class="retry-btn" @click="emit('retry')">
      <RefreshCw :size="14" />
      <span>重试</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  min-height: 240px;
}

.error-icon {
  color: var(--color-danger);
  margin-bottom: 16px;
  opacity: 0.7;
}

.error-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px;
}

.error-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 320px;
  line-height: 1.5;
}

.retry-btn {
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: background 120ms var(--ease-standard);

  &:hover {
    background: var(--color-primary-hover);
  }
}
</style>
