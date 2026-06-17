<script setup lang="ts">
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  value: number | string
  label: string
  trend?: 'up' | 'down' | 'flat'
  trendValue?: string
  description?: string
  accent?: 'primary' | 'accent' | 'success' | 'warning' | 'danger'
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  accent: 'primary',
  trend: 'flat'
})

const valueDisplay = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('zh-CN')
  }
  return props.value
})

const trendColor = computed(() => {
  if (props.trend === 'up') return 'var(--color-success)'
  if (props.trend === 'down') return 'var(--color-danger)'
  return 'var(--color-text-tertiary)'
})

const accentColor = computed(() => {
  switch (props.accent) {
    case 'accent': return 'var(--color-accent)'
    case 'success': return 'var(--color-success)'
    case 'warning': return 'var(--color-warning)'
    case 'danger': return 'var(--color-danger)'
    default: return 'var(--color-primary)'
  }
})
</script>

<template>
  <div class="stat-card" :style="{ '--accent-color': accentColor }">
    <div class="header">
      <div v-if="icon" class="icon" :style="{ background: accentColor, color: '#fff' }">
        <component :is="icon" :size="16" />
      </div>
      <span class="label">{{ label }}</span>
    </div>

    <div class="body">
      <div class="value">{{ valueDisplay }}</div>
      <div v-if="trend && trendValue" class="trend" :style="{ color: trendColor }">
        <component
          :is="trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus"
          :size="14"
        />
        <span>{{ trendValue }}</span>
      </div>
    </div>

    <div v-if="description" class="description">{{ description }}</div>
  </div>
</template>

<style scoped lang="scss">
.stat-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 200ms var(--ease-standard);
  position: relative;
  overflow: hidden;
  cursor: default;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--accent-color);
    opacity: 0.6;
  }

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
}

.icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.label {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.body {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}

.description {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}
</style>
