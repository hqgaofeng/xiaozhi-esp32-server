# Phase 3 报告 — 首页 Dashboard

> 完成日期:2026-06-12
> 状态:**文件就位,等待用户本地跑通验收**

---

## 1. 创建的文件(5 个核心组件 + 1 个 View)

### Dashboard 组件
- ✅ `src/components/dashboard/StatCard.vue` — 统计卡(数字 / 趋势 / 副标题 / 图标)
- ✅ `src/components/dashboard/AgentCard.vue` — 智能体卡(头像 / 名称 / 调用次数 / 状态点 / 操作菜单)
- ✅ `src/components/dashboard/DeviceCard.vue` — 设备卡(设备图标 / MAC 末 4 位 / 状态点 / 当前智能体 / 对话唤醒次数)
- ✅ `src/components/dashboard/LiveStream.vue` — 实时调用流(等宽字体 / 级别筛选 / 暂停/清空/导出 / 自动滚动 / **Mock 数据**)

### View
- ✅ `src/views/Home.vue` — 首页 Dashboard(替换 LegacyView 占位)
  - 4 统计卡
  - 智能体矩阵(2x2)
  - 设备矩阵(2x2)
  - 实时调用流
  - 5 档断点响应式(桌面 4 列 / 平板 3 列 / Pad 2 列 / 手机 1 列)

### Router
- ✅ `/home` 路由指向新的 `Home.vue`

---

## 2. 关键设计决策

### Mock 数据先行
- 23 设备 / 19 在线 / 156 对话 / 432 唤醒 — 写在组件里
- 实时流**模拟生成器**(`setInterval` 每 800ms 一条),Phase 6 替换为 WebSocket
- 这样可以**完整跑通视觉验收**,不用等真实 API

### 实时流是设计语言的"灵魂"
- 深色 `#0F1626` 背景
- 等宽字体 `JetBrains Mono` 系统降级
- 4 个日志级别用语义色:INFO 蓝 / WARN 黄 / ERROR 红 / DEBUG 灰
- 设备名用辅色 `#FF7A45` 暖橙
- 顶栏:级别筛选(全部/INFO/WARN/ERROR)+ 暂停/清空/导出
- 自动滚动到底部,hover 行时高亮

### 矩阵卡设计
- 智能体卡:紫色头像(`#4F6BFF` 浅底)+ 在线状态点(心跳脉冲)
- 设备卡:橙色头像(`#FF7A45` 浅底)+ 状态点 + MAC 末 4 位(等宽字体)
- 离线/故障状态自动降低 opacity,符合"减弱但保留"原则
- 右上角"..."菜单:编辑/统计/启用停用
- hover:阴影从 sm → md,卡片上浮 2px,边框变主色

### 响应式策略
- 桌面 (≥ 1024):4 列统计 + 2 列矩阵(2x2)+ 实时流占满
- 平板 (1024-1279):3 列统计 + 2 列矩阵
- Pad (640-1023):2 列统计 + 1 列矩阵(智能体上,设备下)
- 手机 (< 640):1 列统计 + 1 列矩阵 + 实时流折叠

---

## 3. 验收 Checklist

```powershell
cd D:\ESP32\xiaozhi-esp32-server-new\main\manager-web
npm run dev
```

访问 http://localhost:5173/**home**(先登录或模拟登录):
- [ ] 4 个统计卡(23 设备 / 19 在线 / 156 对话 / 432 唤醒)有趋势
- [ ] 智能体矩阵显示 4 张卡(2x2)
- [ ] 设备矩阵显示 4 张卡(2x2)
- [ ] 实时调用流每 800ms 增加一条新日志
- [ ] 实时流筛选按钮可切换(全部/INFO/WARN/ERROR)
- [ ] 暂停按钮生效(新日志不再增加)
- [ ] 清空按钮清空当前日志
- [ ] 导出按钮下载 txt 文件

**切档测试**:
- 浏览器 DevTools 切桌面 → 平板(1024-1280)→ Pad(640-1023)→ 手机(< 640)
- 统计卡列数变化(4→3→2→1)
- 矩阵卡列数变化(2x2→2x1→1)
- 实时流宽度跟随

**交互测试**:
- 智能体卡 hover:阴影上浮
- 智能体卡点击:跳 `/agent-template-management`
- 智能体卡"..."菜单:弹 3 项
- 设备卡点击:跳 `/device-management`

---

## 4. 已知局限(留 Phase 4-6)

- Mock 数据写死,需要 Phase 6 接真实 API
- 实时流是 setInterval 模拟,Phase 6 换 WebSocket
- 智能体/设备卡点击都跳占位,Phase 4 重做详情
- 矩阵卡只显示 4 个,完整列表在 `/agent-template-management` 和 `/device-management`
- 数字人 Tab 切换**未实现**(Phase 5 接入)

---

## 5. 接下来 Phase 4 预告

- 设备管理(表格/卡片/列表三端)
- 设备详情 Drawer(5 Tab)
- 智能体管理 + 详情
- 对话记录(消息流)
- 麦克风唤醒交互
