<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const search = ref('')
const userMenuOpen = ref(false)

function handleSearch() {
  if (!search.value.trim()) return
  toast.info(`搜索: ${search.value}(Phase 4 实装)`)
}

function goLogin() {
  router.push('/login')
}

async function logout() {
  await auth.logout()
  toast.success('已退出登录')
  goLogin()
}

function toggleMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

function closeMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.user-menu')) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<template>
  <div class="topbar">
    <!-- 搜索框 -->
    <div class="search">
      <Search :size="16" class="search-icon" />
      <input
        v-model="search"
        type="text"
        placeholder="搜索设备、智能体、配置…"
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <span class="search-kbd">⌘K</span>
    </div>

    <!-- 右侧操作区 -->
    <div class="actions">
      <button class="action-btn" aria-label="通知">
        <Bell :size="18" />
        <span class="action-dot"></span>
      </button>

      <div class="user-menu">
        <button class="user-trigger" @click="toggleMenu">
          <div class="user-avatar">
            <User :size="16" />
          </div>
          <span class="user-name">{{ auth.username || '未登录' }}</span>
          <ChevronDown :size="14" />
        </button>
        <Transition name="dropdown">
          <div v-if="userMenuOpen" class="user-dropdown">
            <button class="dropdown-item" @click="goLogin">
              <User :size="16" />
              <span>切换账号</span>
            </button>
            <button class="dropdown-item dropdown-item--danger" @click="logout">
              <LogOut :size="16" />
              <span>退出登录</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.topbar {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
}

.search {
  flex: 1;
  max-width: 480px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-page);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  height: 36px;
  transition: all 120ms var(--ease-standard);

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-glow);
  }
}

.search-icon {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: var(--color-text-tertiary);
  }
}

.search-kbd {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-text-tertiary);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.action-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: var(--color-bg-page);
    color: var(--color-text-primary);
  }
}

.action-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-danger);
  box-shadow: 0 0 0 2px var(--color-bg-surface);
}

.user-menu {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  color: var(--color-text-primary);
  transition: background 120ms var(--ease-standard);

  &:hover {
    background: var(--color-bg-page);
  }
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 180px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 4px;
  z-index: 200;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--color-text-primary);
  text-align: left;

  &:hover {
    background: var(--color-bg-page);
  }

  &--danger {
    color: var(--color-danger);

    &:hover {
      background: var(--color-danger-light);
    }
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 120ms var(--ease-standard), transform 120ms var(--ease-standard);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
