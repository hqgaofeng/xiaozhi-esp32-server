# 更新日志 / Changelog

所有 v2 重构的更改都记录在这里。格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

## [v2.0.0] - 2026-06-17

小智智控台 v2 重构版本,基于 ui-ux-pro-max 设计规范全面改造。

### ✨ 新增 (New)

**架构基础**
- Vue 3.5 + Vite 5 + TypeScript 全栈
- Element Plus 2.8 按需引入(替代 Element UI 2)
- Pinia 2 状态管理(替代 Vuex 3)
- Lucide Icons 替代 Element Icons
- mitt 事件总线(替代 Vue Event Bus)

**设计系统**
- 完整的设计 token 体系(色板/字号/间距/动效/阴影/圆角)
- 4 档响应式断点:mobile (<640) / pad (640-1024) / tablet (1024-1280) / desktop (≥1280)
- CSS 变量驱动主题(`tokens.css`),可一键切换暗色模式(预留)
- Element Plus 主题色覆盖为深空蓝紫 `#4F6BFF` + 暖橙 `#FF7A45`
- 复用了 ui-ux-pro-max 161 行业规则中的"AI/IoT 平台"规则

**核心页面**
- **首页 Dashboard**:`StatCard` / `AgentCard` / `DeviceCard` / `LiveStream` 4 个组件
  - 4 个统计卡(设备总数/在线/今日对话/唤醒次数)
  - 智能体矩阵 2x2(可扩展到 6+ 卡片)
  - 设备矩阵 2x2(可扩展到 12+ 卡片)
  - 实时调用流(等宽字体,4 档日志级别筛选,暂停/清空/导出,Mock 数据 800ms/条)
- **设备管理**:`DeviceTable` / `AddDeviceDrawer` / `DeviceDetailDrawer`
  - 桌面表格 8 列 / Pad 卡片网格 / 手机列表
  - 添加 Drawer 4 组字段分组(基本信息/网络/智能体/高级)+ 扫码入口
  - 详情 Drawer 5 Tab(基础/智能体/网络/OTA/日志)
  - 工具条:搜索 / 状态筛选 / 房间筛选 / 视图切换 / 批量解绑
- **智能体管理**:`AgentTable` / `AddAgentDrawer` / `AgentDetailDrawer`
  - 桌面表格 9 列(名称/角色/状态/记忆/声纹/调用数/时间/操作)
  - 详情 Drawer 5 Tab(基础/知识库/工具/声音/记忆)
  - 模板市场 6 个模板(客服/儿童/医疗/厨房/健身/会议)
  - 添加/编辑共用同一 Drawer(根据 `agent` prop 切换)
- **对话记录**:`MessageBubble` 4 种气泡 + 三态列表详情
  - 用户消息(主色背景右对齐)/ 助手(白底左对齐)/ 工具调用(可折叠 JSON)/ 错误(红带重试)
  - 桌面 split(列表 320px + 详情)/ Pad split(列表 280px)/ 手机 push 详情页
  - 消息流滚动到底部 / 模拟回复 / URL 同步(`?id=`)
- **麦克风唤醒**:`useVoiceRecorder` 状态机 + `MicButton` + `VoiceOverlay`
  - 6 状态机:idle / recording / processing / speaking / cancelled / error
  - 桌面/Pad:右下角长按小气泡(暖橙 → 红录音 → 蓝处理 → 绿回答)
  - 手机:全屏沉浸(Live2D emoji 占位 + 大波形 + 上滑取消)
  - 实时波形动画 + 时长计时 + 模拟 ASR/TTS
- **5 个高频设置页**(用通用 `SettingsLayout`):
  - 系统配置(服务/安全/通知/存储/网络/集成,6 个 panel)
  - 开发者(API Token / MQTT 指令 / Webhook / OpenAPI / CLI)
  - 声纹管理(用户卡片 / 3 步注册向导 / 阈值设置)
  - 语音资源(音色库 / 我的克隆 / TTS Provider)
  - OTA 升级(固件包 / 升级历史 / 上传)

**通用组件**
- `SettingsLayout`:左侧导航 + 右侧内容,响应式三态(手机汉堡按钮 → 抽屉)
- `EmptyState` / `LoadingState` / `ErrorState`:标准空/加载/错误态
- `useToast` composable:统一 Toast 封装(基于 ElMessage)

**Composables**
- `useBreakpoint`:4 档断点 + 响应式宽度(全局 reactive,所有调用方共享)
- `useEventBus`:mitt 包装
- `useToast`:Toast/MessageBox/Notification
- `useVoiceRecorder`:6 状态录音机

**文档**
- `docs/design-system.md`:完整设计系统规范
- `docs/responsive-spec.md`:三端响应式交互细则
- `docs/refactor-roadmap.md`:6 阶段实施路线图
- `docs/phase-0/2/3-report.md`:各阶段验收报告

### 🔧 改进 (Changed)

- **重写** `useBreakpoint` 修复 Vue 3 HMR 导致的断点判断失效问题
  - 模块加载时立即同步 + 全局 resize 监听 + setInterval 500ms 兜底
  - 不依赖 `onMounted` 生命周期
- **统一** JS 端断点(`useBreakpoint.ts`)与 SCSS 端断点(`_breakpoints.scss`):都是 4 档
- **修复** Element Plus Toast 不显示:`main.ts` 加 `import 'element-plus/dist/index.css'`(按需引入模式下需要手动 import 主题 CSS)
- **同步加载** mock 数据(替代 `import().then()` 异步),避免首屏空表格
- **优化** AgentTable 菜单事件:去掉 Transition 包裹 + 按钮加 `@click.stop` + td 去 `@click.stop`,避免事件冒泡干扰
- **登录页** 完全重写:左半深色品牌区 + 右半浅色表单(原版 Element UI 2 风格已老旧)

### 🐛 修复 (Fixed)

- 修复 Login.vue 的 ElInput 双框问题(浏览器原生 outline + wrapper 边)
- 修复 1024-1279 区间断点不匹配问题(JS 端当 pad,SCSS 端当 tablet)
- 修复 Vite HMR 不重新加载 useBreakpoint 的 bug
- 修复 404 路由回退到 `/:pathMatch(.*)*` 仍加载 LegacyView 的问题(改为统一占位)
- 修复 HMR 时 mockData 异步加载导致首屏空表格

### ⚠️ 破坏性变更 (Breaking)

- 旧的 Element UI 2 + Vue 2.6 + Vuex 3 + Webpack 体系**完全移除**
- 旧的 22 个 Dialog 全部标记为 LegacyView 占位,Phase 3-5 逐步重做
- 部分旧 API 路径变化(以新 router 为准)
- 主题色从 Element UI 默认 `#409EFF` 改为 `#4F6BFF`

### 📋 仍待完成 (Known Limitations)

- Phase 6 联调已与后端 Docker 镜像(`xiaozhi-esp32-server-web`)联调通过,核心 API 跑通
- 部分高级功能(MQTT 真实下发、声纹训练、声波实时识别)仍为 Mock,Phase 7+ 实装
- i18n 暂未接入(目前中文 hardcode)
- 暗色模式预留但未实现
- 10+ 长尾页(模型配置/参数管理/知识库/字典/替词/地址簿等)保持 LegacyView 占位

### 🛠️ 部署

- `Dockerfile-web` 已存在(上游维护)
- `docker-compose.dev.yml` 提供 3 容器联调环境(无 model.pt 依赖)
- 完整 `docker-compose_all.yml` 需要 SenseVoice 模型文件

### 🔧 技术债务

- 单元测试暂未覆盖(Vitest 框架已准备,Phase 7+ 添加)
- E2E 测试暂未实现(Playwright 已规划)
- 旧 23 view 的 LegacyView 占位待 Phase 7+ 迁移
- 暗色模式 / i18n 预留但未实现

---

## [v1.x] - 2026 之前

原 Vue 2.6 + Element UI 2 + Vuex 3 + Webpack 版本(未在本仓库维护)。
