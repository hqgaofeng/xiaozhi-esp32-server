<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

defineProps<{
  icon?: any
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="empty">
    <component :is="icon || Inbox" :size="64" class="empty-icon" />
    <h3 v-if="title" class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-desc">{{ description }}</p>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  min-height: 240px;
}

.empty-icon {
  color: var(--color-text-tertiary);
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 320px;
  line-height: 1.5;
}

.empty-action {
  margin-top: 20px;
}
</style>
