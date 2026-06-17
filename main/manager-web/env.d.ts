/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PROXY_TARGET: string
  readonly VITE_WS_BASE_URL: string
  readonly VITE_WS_PROXY_TARGET: string
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_H5_URL: string
  readonly VITE_USE_CDN: string
  readonly VITE_USE_MOCK: string
  readonly ANALYZE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
