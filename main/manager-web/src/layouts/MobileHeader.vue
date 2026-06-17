<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Search, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
</script>

<template>
  <div class="mobile-header">
    <div class="brand-mini">小智智控台</div>
    <div class="actions">
      <button class="action" aria-label="搜索" @click="router.push('/home')">
        <Search :size="18" />
      </button>
      <button class="action" aria-label="我的" @click="router.push('/user-management')">
        <User :size="18" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.brand-mini {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);

  &:hover {
    background: var(--color-bg-page);
    color: var(--color-text-primary);
  }
}
</style>
