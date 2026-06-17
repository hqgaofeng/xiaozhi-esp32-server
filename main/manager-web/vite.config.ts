import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
        eslintrc: { enabled: true }
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
        dirs: ['src/components']
      }),
      env.ANALYZE === 'true' &&
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true
        })
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      // 显式列出后缀,避免 Vite 默认 .js 优先导致错位
      extensions: ['.ts', '.mjs', '.js', '.mts', '.tsx', '.jsx', '.json', '.vue']
    },

    css: {
      preprocessorOptions: {
        scss: {
          // 移除 additionalData,改由各 SCSS 文件自己 @use token
          api: 'modern-compiler'
        }
      }
    },

    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,
      proxy: {
        '/xiaozhi': {
          target: env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8002',
          changeOrigin: true
        },
        '/ws': {
          target: env.VITE_WS_PROXY_TARGET || 'ws://127.0.0.1:8000',
          ws: true,
          changeOrigin: true
        }
      }
    },

    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            'echarts-vendor': ['echarts']
          }
        }
      },
      chunkSizeWarningLimit: 600
    },

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        'axios',
        'mitt',
        'lucide-vue-next'
      ]
    }
  }
})
