// api/http.ts
// axios 实例 + 拦截器

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { storage } from '@/utils/storage'
import { useEventBus } from '@/composables/useEventBus'

const TOKEN_KEY = 'token'

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/xiaozhi',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器:自动带 token
http.interceptors.request.use(
  (config) => {
    const token = storage.get<string>(TOKEN_KEY)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器:统一处理业务码 + 401
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data
    // 约定:code === 0 表示成功
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === 0) {
        return data.data
      }
      if (data.code === 401) {
        handleUnauthorized()
        return Promise.reject(new Error(data.msg || '未授权'))
      }
      return Promise.reject(new Error(data.msg || `业务错误: ${data.code}`))
    }
    return data
  },
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized()
    }
    const message = error.response?.data?.msg || error.message || '网络错误'
    return Promise.reject(new Error(message))
  }
)

function handleUnauthorized() {
  storage.remove(TOKEN_KEY)
  storage.remove('userInfo')
  useEventBus().emit('auth:logout')
  // 跳登录页(避免循环依赖,直接操作)
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export interface RequestOptions extends AxiosRequestConfig {
  // 预留:重试 / 取消 / 静默等
  silent?: boolean
}

export function get<T = any>(url: string, params?: any, options?: RequestOptions): Promise<T> {
  return http.get<T>(url, { params, ...options })
}

export function post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return http.post<T>(url, data, options)
}

export function put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return http.put<T>(url, data, options)
}

export function del<T = any>(url: string, params?: any, options?: RequestOptions): Promise<T> {
  return http.delete<T>(url, { params, ...options })
}

export default http
