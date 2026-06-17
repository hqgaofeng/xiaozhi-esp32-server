// composables/useEventBus.ts
// 全局事件总线(替代 Vue 2 的 new Vue())

import mitt, { type Emitter } from 'mitt'

type Events = {
  [key: string]: any
}

const emitter: Emitter<Events> = mitt<Events>()

export function useEventBus() {
  return {
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    emit: emitter.emit.bind(emitter),
    clear: emitter.all.clear.bind(emitter.all)
  }
}
