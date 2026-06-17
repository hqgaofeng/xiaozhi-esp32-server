<script setup lang="ts">
import { useBreakpoint } from '@/composables/useBreakpoint'
import SidebarNav from './SidebarNav.vue'
import TopBar from './TopBar.vue'
import PadTopTabs from './PadTopTabs.vue'
import MobileHeader from './MobileHeader.vue'
import MobileTabBar from './MobileTabBar.vue'

const { isMobile, isPad, isTablet, isDesktop } = useBreakpoint()
</script>

<template>
  <div class="app-shell">
    <!-- 桌面 (≥ 1024) : 侧边栏 + 顶栏 -->
    <template v-if="isDesktop">
      <aside class="app-sidebar">
        <SidebarNav />
      </aside>
      <div class="app-main">
        <header class="app-topbar">
          <TopBar />
        </header>
        <main class="app-content">
          <router-view />
        </main>
      </div>
    </template>

    <!-- Pad (640-1023) : 顶部 Tab + 顶栏 -->
    <template v-else-if="isPad || isTablet">
      <header class="app-pad-tabs">
        <PadTopTabs />
      </header>
      <div class="app-main">
        <header class="app-topbar">
          <TopBar />
        </header>
        <main class="app-content">
          <router-view />
        </main>
      </div>
    </template>

    <!-- 手机 (< 640) : 极简顶栏 + 内容 + 底部 Tab Bar -->
    <template v-else-if="isMobile">
      <header class="app-mobile-header">
        <MobileHeader />
      </header>
      <main class="app-content app-content--mobile">
        <router-view />
      </main>
      <nav class="app-mobile-tabbar safe-area-bottom">
        <MobileTabBar />
      </nav>
    </template>

    <!-- 宽屏 (≥ 1680) : 跟桌面一样但主区更宽 -->
    <template v-else>
      <aside class="app-sidebar">
        <SidebarNav />
      </aside>
      <div class="app-main">
        <header class="app-topbar">
          <TopBar />
        </header>
        <main class="app-content">
          <router-view />
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/breakpoints' as *;

.app-shell {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  width: 100%;
}

// 手机/Pad(< 1024):手机/Pad 端无 sidebar,直接占满
@media (max-width: 1023px) {
  .app-shell {
    flex-direction: column;
  }
}

// === 桌面布局 ===
.app-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--color-bg-sidebar);
  color: var(--color-text-on-dark);
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  z-index: 100;
}

.app-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-topbar {
  height: 56px;
  flex-shrink: 0;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-divider);
  position: sticky;
  top: 0;
  z-index: 50;
}

.app-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.app-content--mobile {
  padding-bottom: 72px;  // 给底部 Tab Bar 留位置(56px + iOS Home 34px 安全)
}

// === Pad 布局 ===
.app-pad-tabs {
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-divider);
  position: sticky;
  top: 0;
  z-index: 100;
}

// === 手机布局 ===
.app-mobile-header {
  height: 48px;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-divider);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-mobile-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--color-bg-surface);
  border-top: 1px solid var(--color-divider);
  z-index: 100;
  // iOS Home Indicator 安全区已在 safe-area-bottom 类处理
}
</style>
