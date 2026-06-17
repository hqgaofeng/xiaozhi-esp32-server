<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Play, Pause, Trash2, Download, Filter } from 'lucide-vue-next'

interface LogEntry {
  id: number
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  device?: string
  message: string
}

const props = withDefaults(defineProps<{
  source?: 'home' | 'all' | 'device'
  deviceId?: string
  maxLines?: number
}>(), {
  source: 'home',
  maxLines: 200
})

const logs = ref<LogEntry[]>([])
const isPaused = ref(false)
const autoScroll = ref(true)
const levelFilter = ref<'all' | 'INFO' | 'WARN' | 'ERROR'>('all')
const logsEl = ref<HTMLElement>()

let mockTimer: number | null = null
let nextId = 1

const filteredLogs = computed(() => {
  if (levelFilter.value === 'all') return logs.value
  return logs.value.filter((l) => l.level === levelFilter.value)
})

// 模拟实时日志生成(Phase 6 替换为 WebSocket)
function generateMockLog() {
  if (isPaused.value) return

  const levels: LogEntry['level'][] = ['INFO', 'INFO', 'INFO', 'INFO', 'DEBUG', 'WARN', 'INFO', 'INFO', 'ERROR', 'INFO']
  const devices = ['客厅音箱-01', '厨房音箱-01', '卧室音箱-01', '书房音箱-01', '主卧小智']
  const messages = [
    '唤醒词检测成功 → 启动录音',
    'ASR 识别完成:你好小智,今天天气怎么样 (0.42s)',
    'LLM 响应生成中...',
    'TTS 合成开始:今天深圳多云转晴,温度 24-30°C',
    '工具调用: weather.query("深圳")',
    'MCP 指令已下发: device.led.on',
    '设备心跳: ESP32-S3 alive (RSSI -52dBm)',
    '记忆检索: 命中"用户偏好"3 条',
    '声纹识别: 用户 #user_001 置信度 0.96',
    '错误: WebSocket 重连 (尝试 3/5)'
  ]

  const level = levels[Math.floor(Math.random() * levels.length)]
  const entry: LogEntry = {
    id: nextId++,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    level,
    device: devices[Math.floor(Math.random() * devices.length)],
    message: messages[Math.floor(Math.random() * messages.length)]
  }

  logs.value.push(entry)
  if (logs.value.length > props.maxLines) {
    logs.value.shift()
  }
}

function clearLogs() {
  logs.value = []
}

function togglePause() {
  isPaused.value = !isPaused.value
}

function setFilter(level: typeof levelFilter.value) {
  levelFilter.value = level
}

function exportLogs() {
  const text = logs.value
    .map((l) => `[${l.timestamp}] [${l.level}]${l.device ? ' [' + l.device + ']' : ''} ${l.message}`)
    .join('\n')
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `xiaozhi-logs-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

watch(filteredLogs, () => {
  if (autoScroll.value) {
    requestAnimationFrame(() => {
      if (logsEl.value) {
        logsEl.value.scrollTop = logsEl.value.scrollHeight
      }
    })
  }
})

onMounted(() => {
  // 启动 mock 流
  mockTimer = window.setInterval(generateMockLog, 800)
})

onBeforeUnmount(() => {
  if (mockTimer) {
    clearInterval(mockTimer)
  }
})
</script>

<template>
  <div class="live-stream">
    <div class="toolbar">
      <div class="title">
        <span class="title-text">实时调用流</span>
        <span class="counter">{{ filteredLogs.length }} 条</span>
      </div>

      <div class="actions">
        <div class="filter-group">
          <Filter :size="14" />
          <button
            v-for="lv in (['all', 'INFO', 'WARN', 'ERROR'] as const)"
            :key="lv"
            class="filter-btn"
            :class="{ 'is-active': levelFilter === lv }"
            @click="setFilter(lv)"
          >
            {{ lv === 'all' ? '全部' : lv }}
          </button>
        </div>

        <button class="tool-btn" @click="togglePause" :aria-label="isPaused ? '继续' : '暂停'">
          <Play v-if="isPaused" :size="14" />
          <Pause v-else :size="14" />
        </button>

        <button class="tool-btn" @click="clearLogs" aria-label="清空">
          <Trash2 :size="14" />
        </button>

        <button class="tool-btn" @click="exportLogs" aria-label="导出">
          <Download :size="14" />
        </button>
      </div>
    </div>

    <div ref="logsEl" class="logs" :class="{ 'is-paused': isPaused }">
      <div v-if="filteredLogs.length === 0" class="empty">
        等待数据流...
      </div>
      <div v-for="log in filteredLogs" :key="log.id" class="line" :class="`level-${log.level}`">
        <span class="time">{{ log.timestamp }}</span>
        <span class="level">{{ log.level }}</span>
        <span v-if="log.device" class="device">@{{ log.device }}</span>
        <span class="message">{{ log.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.live-stream {
  background: var(--color-bg-code);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  gap: 12px;
  flex-wrap: wrap;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-on-dark);
}

.title-text {
  font-size: 13px;
  font-weight: 600;
}

.counter {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 9999px;
  font-family: var(--font-mono);
}

.actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.4);
}

.filter-btn {
  padding: 3px 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  font-weight: 500;
  transition: all 120ms var(--ease-standard);

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  &.is-active {
    background: var(--color-primary);
    color: white;
  }
}

.tool-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  transition: all 120ms var(--ease-standard);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: white;
  }
}

.logs {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;

  &.is-paused {
    opacity: 0.85;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }
}

.empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  padding: 32px 16px;
  font-size: 12px;
}

.line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 2px 16px;
  color: rgba(255, 255, 255, 0.7);

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
}

.time {
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
}

.level {
  flex-shrink: 0;
  font-weight: 600;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  width: 42px;
  text-align: center;
}

.device {
  color: var(--color-accent);
  flex-shrink: 0;
  font-size: 11px;
}

.message {
  color: rgba(255, 255, 255, 0.85);
  flex: 1;
  word-break: break-word;
}

.level-INFO .level {
  background: rgba(90, 200, 250, 0.15);
  color: #5AC8FA;
}
.level-WARN .level {
  background: rgba(255, 176, 32, 0.18);
  color: #FFB020;
}
.level-ERROR .level {
  background: rgba(255, 77, 79, 0.2);
  color: #FF6B6D;
}
.level-DEBUG .level {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
}
</style>
