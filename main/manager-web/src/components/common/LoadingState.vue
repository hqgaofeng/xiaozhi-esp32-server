<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

defineProps<{
  text?: string
  inline?: boolean
}>()
</script>

<template>
  <div class="loading" :class="{ 'is-inline': inline }">
    <Loader2 :size="24" class="loading-icon" />
    <span v-if="text" class="loading-text">{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.loading.is-inline {
  padding: 0;
  gap: 6px;
}

.loading-icon {
  animation: spin 0.9s linear infinite;
  color: var(--color-primary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
