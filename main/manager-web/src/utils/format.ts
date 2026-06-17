// utils/format.ts
// 通用格式化工具

/**
 * 相对时间(如"2 分钟前")
 */
export function relativeTime(timestamp: number | string | Date): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const diff = Date.now() - date.getTime()
  const sec = Math.floor(diff / 1000)

  if (sec < 60) return '刚刚'
  if (sec < 3600) return `${Math.floor(sec / 60)} 分钟前`
  if (sec < 86400) return `${Math.floor(sec / 3600)} 小时前`
  if (sec < 604800) return `${Math.floor(sec / 86400)} 天前`
  if (sec < 2592000) return `${Math.floor(sec / 604800)} 周前`
  if (sec < 31536000) return `${Math.floor(sec / 2592000)} 个月前`
  return `${Math.floor(sec / 31536000)} 年前`
}

/**
 * 数字千分位
 */
export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * 字节数 → 人类可读(B / KB / MB / GB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${units[i]}`
}

/**
 * 时长 ms → mm:ss
 */
export function formatDuration(ms: number): string {
  const sec = Math.floor(ms / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * MAC 地址掩码
 */
export function maskMac(mac: string, keepTail = 4): string {
  if (!mac || mac.length < keepTail) return mac
  const tail = mac.slice(-keepTail)
  return `**:**:**:**:**:${tail}`
}

/**
 * 截断字符串
 */
export function truncate(s: string, max = 20, suffix = '...'): string {
  if (!s) return ''
  return s.length > max ? s.slice(0, max) + suffix : s
}
