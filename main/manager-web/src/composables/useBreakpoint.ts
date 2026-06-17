// composables/useBreakpoint.ts
// 全局响应式断点 - 模块加载时立即初始化 + 全局 resize 监听
// 不依赖 onMounted 生命周期,保证永远同步

import { ref, computed, onBeforeUnmount } from 'vue'

export type Breakpoint = 'mobile' | 'pad' | 'tablet' | 'desktop' | 'wide'

// 模块级 ref
const width = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)

let resizeTimer: number | null = null
let cleanup: (() => void) | null = null

function update() {
  if (typeof window === 'undefined') return
  width.value = window.innerWidth
}

// 模块加载时立即初始化(在浏览器环境)
if (typeof window !== 'undefined') {
  // 立即同步
  width.value = window.innerWidth

  // 注册全局 resize 监听
  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(update, 100) as unknown as number
  }
  window.addEventListener('resize', onResize)

  // 兜底:每 500ms 检查一次,保证同步
  const poll = window.setInterval(() => {
    if (window.innerWidth !== width.value) {
      width.value = window.innerWidth
    }
  }, 500)

  cleanup = () => {
    window.removeEventListener('resize', onResize)
    clearInterval(poll)
    if (resizeTimer) clearTimeout(resizeTimer)
  }
}

export function useBreakpoint() {
  // 组件卸载时不清全局监听
  onBeforeUnmount(() => {})

  return {
    width: computed(() => width.value),
    isMobile: computed(() => width.value < 640),
    isPad: computed(() => width.value >= 640 && width.value < 1024),
    isTablet: computed(() => width.value >= 1024 && width.value < 1280),
    isDesktop: computed(() => width.value >= 1280 && width.value < 1680),
    isWide: computed(() => width.value >= 1680),
    breakpoint: computed<Breakpoint>(() => {
      if (width.value < 640) return 'mobile'
      if (width.value < 1024) return 'pad'
      if (width.value < 1280) return 'tablet'
      if (width.value < 1680) return 'desktop'
      return 'wide'
    })
  }
}
