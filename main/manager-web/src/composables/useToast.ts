// composables/useToast.ts
// 统一 Toast 封装(ElMessage)

import { ElMessage, ElMessageBox, ElNotification, type MessageOptions } from 'element-plus'

export type ToastType = 'success' | 'warning' | 'info' | 'error'

export function useToast() {
  function show(message: string, type: ToastType = 'info', options: Partial<MessageOptions> = {}) {
    return ElMessage({
      message,
      type,
      duration: 2500,
      showClose: true,
      ...options
    })
  }

  return {
    success: (msg: string, opts?: Partial<MessageOptions>) => show(msg, 'success', opts),
    warning: (msg: string, opts?: Partial<MessageOptions>) => show(msg, 'warning', opts),
    info:    (msg: string, opts?: Partial<MessageOptions>) => show(msg, 'info', opts),
    error:   (msg: string, opts?: Partial<MessageOptions>) => show(msg, 'error', opts),

    notify: (opts: {
      title: string
      message: string
      type?: ToastType
      duration?: number
    }) => {
      return ElNotification({
        position: 'top-right',
        duration: 4000,
        ...opts
      })
    },

    confirm: (message: string, title = '确认', options = {}) => {
      return ElMessageBox.confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        ...options
      })
    },

    alert: (message: string, title = '提示', options = {}) => {
      return ElMessageBox.alert(message, title, {
        confirmButtonText: '我知道了',
        ...options
      })
    }
  }
}
