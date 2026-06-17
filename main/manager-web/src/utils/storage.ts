// utils/storage.ts
// localStorage 封装,支持过期时间

interface StorageItem<T = any> {
  value: T
  expireAt?: number  // 毫秒时间戳
}

export const storage = {
  get<T = any>(key: string, defaultValue: T | null = null): T | null {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return defaultValue
      const item: StorageItem<T> = JSON.parse(raw)
      if (item.expireAt && item.expireAt < Date.now()) {
        localStorage.removeItem(key)
        return defaultValue
      }
      return item.value
    } catch {
      return defaultValue
    }
  },

  set<T = any>(key: string, value: T, ttlMs?: number): void {
    const item: StorageItem<T> = {
      value,
      expireAt: ttlMs ? Date.now() + ttlMs : undefined
    }
    localStorage.setItem(key, JSON.stringify(item))
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  }
}
