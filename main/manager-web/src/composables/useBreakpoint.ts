// composables/useBreakpoint.ts
// 响应式断点判断,Composition API

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export type Breakpoint = 'mobile' | 'pad' | 'tablet' | 'desktop' | 'wide'

const QUERIES = {
  mobile: '(max-width: 639px)',
  pad: '(min-width: 640px) and (max-width: 1023px)',
  tablet: '(min-width: 1024px) and (max-width: 1279px)',
  desktop: '(min-width: 1280px) and (max-width: 1679px)',
  wide: '(min-width: 1680px)'
}

export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
  const breakpoint = ref<Breakpoint>('desktop')

  const matches = {
    mobile: ref(false),
    pad: ref(false),
    tablet: ref(false),
    desktop: ref(false),
    wide: ref(false),
    isMobile: computed(() => width.value < 640),
    isPad: computed(() => width.value >= 640 && width.value < 1024),
    isTabletOrUp: computed(() => width.value >= 1024),
    isDesktop: computed(() => width.value >= 1280),
    isWide: computed(() => width.value >= 1680)
  }

  let mediaQueries: MediaQueryList[] = []
  let mqListeners: Array<() => void> = []

  function update() {
    width.value = window.innerWidth
    for (const key of Object.keys(QUERIES) as Array<keyof typeof QUERIES>) {
      matches[key].value = window.matchMedia(QUERIES[key]).matches
    }
    if (matches.mobile.value) breakpoint.value = 'mobile'
    else if (matches.pad.value) breakpoint.value = 'pad'
    else if (matches.tablet.value) breakpoint.value = 'tablet'
    else if (matches.wide.value) breakpoint.value = 'wide'
    else breakpoint.value = 'desktop'
  }

  function onResize() {
    let timer: number | null = null
    return () => {
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(update, 100)
    }
  }

  onMounted(() => {
    update()
    const handler = onResize()
    window.addEventListener('resize', handler)

    // 注册 mq 监听
    for (const key of Object.keys(QUERIES) as Array<keyof typeof QUERIES>) {
      const mq = window.matchMedia(QUERIES[key])
      const listener = () => update()
      mq.addEventListener('change', listener)
      mediaQueries.push(mq)
      mqListeners.push(() => mq.removeEventListener('change', listener))
    }

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handler)
      mqListeners.forEach((off) => off())
    })
  })

  return {
    width,
    breakpoint,
    ...matches
  }
}
