<script setup lang="ts">
// 设备 mock 数据 — Phase 6 替换为真实 API
export interface Device {
  id: string
  name: string
  mac: string
  model: string
  status: 'online' | 'offline' | 'error'
  agent: string
  room: string
  wakeWord: string
  volume: number
  wifi: string
  ip: string
  firmware: string
  callsToday: number
  wakesToday: number
  lastActive: string
  signal: 'strong' | 'medium' | 'weak' | 'offline'
  registeredAt: string
}

export const mockDevices: Device[] = [
  { id: 'd1', name: '客厅音箱-01', mac: '11:22:33:44:55:66', model: 'ESP32-S3-BOX', status: 'online', agent: '标准小智', room: '客厅', wakeWord: '你好小智', volume: 60, wifi: 'Xiaozhi-Home', ip: '192.168.1.42', firmware: 'v1.2.3', callsToday: 23, wakesToday: 47, lastActive: '2 分钟前', signal: 'strong', registeredAt: '2026-04-12' },
  { id: 'd2', name: '厨房音箱-01', mac: '11:22:33:44:55:67', model: 'ESP32-S3-BOX', status: 'online', agent: '厨房助手', room: '厨房', wakeWord: '嗨小厨', volume: 75, wifi: 'Xiaozhi-Home', ip: '192.168.1.43', firmware: 'v1.2.3', callsToday: 12, wakesToday: 28, lastActive: '1 小时前', signal: 'strong', registeredAt: '2026-04-12' },
  { id: 'd3', name: '卧室音箱-01', mac: '11:22:33:44:55:68', model: 'ESP32-S3-BOX-Lite', status: 'online', agent: '故事姐姐', room: '主卧', wakeWord: '小智小智', volume: 35, wifi: 'Xiaozhi-Home', ip: '192.168.1.44', firmware: 'v1.2.2', callsToday: 8, wakesToday: 14, lastActive: '30 分钟前', signal: 'medium', registeredAt: '2026-04-20' },
  { id: 'd4', name: '书房音箱-01', mac: '11:22:33:44:55:69', model: 'ESP32-S3-BOX', status: 'offline', agent: '标准小智', room: '书房', wakeWord: '你好小智', volume: 50, wifi: 'Xiaozhi-Home', ip: '192.168.1.45', firmware: 'v1.1.9', callsToday: 0, wakesToday: 0, lastActive: '3 天前', signal: 'offline', registeredAt: '2026-03-15' },
  { id: 'd5', name: '主卧小智', mac: '11:22:33:44:55:70', model: 'ESP32-S3-BOX', status: 'error', agent: '标准小智', room: '主卧', wakeWord: '小智小智', volume: 40, wifi: 'Xiaozhi-Home', ip: '192.168.1.46', firmware: 'v1.2.0', callsToday: 5, wakesToday: 11, lastActive: '15 分钟前', signal: 'weak', registeredAt: '2026-05-01' },
  { id: 'd6', name: '次卧音箱', mac: '11:22:33:44:55:71', model: 'ESP32-S3-BOX-Lite', status: 'online', agent: '健身教练', room: '次卧', wakeWord: '嗨教练', volume: 45, wifi: 'Xiaozhi-Home', ip: '192.168.1.47', firmware: 'v1.2.3', callsToday: 6, wakesToday: 12, lastActive: '5 分钟前', signal: 'strong', registeredAt: '2026-05-08' },
  { id: 'd7', name: '玄关音箱', mac: '11:22:33:44:55:72', model: 'ESP32-C3', status: 'online', agent: '标准小智', room: '玄关', wakeWord: '你好小智', volume: 55, wifi: 'Xiaozhi-Home', ip: '192.168.1.48', firmware: 'v1.2.3', callsToday: 4, wakesToday: 18, lastActive: '8 分钟前', signal: 'strong', registeredAt: '2026-05-12' },
  { id: 'd8', name: '卫生间音箱', mac: '11:22:33:44:55:73', model: 'ESP32-S3-BOX-Mini', status: 'online', agent: '故事姐姐', room: '卫生间', wakeWord: '小智小智', volume: 65, wifi: 'Xiaozhi-Home', ip: '192.168.1.49', firmware: 'v1.2.3', callsToday: 2, wakesToday: 9, lastActive: '20 分钟前', signal: 'medium', registeredAt: '2026-05-20' },
  { id: 'd9', name: '阳台音箱', mac: '11:22:33:44:55:74', model: 'ESP32-S3-BOX', status: 'offline', agent: '标准小智', room: '阳台', wakeWord: '你好小智', volume: 50, wifi: 'Xiaozhi-Home', ip: '192.168.1.50', firmware: 'v1.2.1', callsToday: 0, wakesToday: 0, lastActive: '5 天前', signal: 'offline', registeredAt: '2026-04-01' },
  { id: 'd10', name: '茶室音箱', mac: '11:22:33:44:55:75', model: 'ESP32-S3-BOX', status: 'online', agent: '茶道助手', room: '茶室', wakeWord: '品茶', volume: 30, wifi: 'Xiaozhi-Home', ip: '192.168.1.51', firmware: 'v1.2.3', callsToday: 1, wakesToday: 3, lastActive: '1 小时前', signal: 'strong', registeredAt: '2026-05-25' },
  { id: 'd11', name: '工作室小智', mac: '11:22:33:44:55:76', model: 'ESP32-S3-BOX-Pro', status: 'online', agent: '客服小智', room: '工作室', wakeWord: '小智小智', volume: 50, wifi: 'Xiaozhi-Office', ip: '192.168.2.10', firmware: 'v1.2.3', callsToday: 18, wakesToday: 32, lastActive: '3 分钟前', signal: 'strong', registeredAt: '2026-05-15' },
  { id: 'd12', name: '会议室音箱', mac: '11:22:33:44:55:77', model: 'ESP32-S3-BOX-Pro', status: 'online', agent: '会议助手', room: '会议室', wakeWord: '嗨会议', volume: 60, wifi: 'Xiaozhi-Office', ip: '192.168.2.11', firmware: 'v1.2.3', callsToday: 11, wakesToday: 22, lastActive: '12 分钟前', signal: 'strong', registeredAt: '2026-05-18' }
]

// 房间列表(供筛选)
export const mockRooms = [
  '客厅', '厨房', '主卧', '次卧', '书房', '玄关', '卫生间', '阳台', '茶室', '工作室', '会议室'
]

// 智能体列表(供分配)
export const mockAgentNames = [
  '标准小智', '厨房助手', '医疗咨询', '客服小智', '故事姐姐', '健身教练', '茶道助手', '会议助手'
]
</script>
