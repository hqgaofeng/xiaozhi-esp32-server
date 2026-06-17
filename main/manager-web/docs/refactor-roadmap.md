# 小智智控台重构 — 实施路线图 v1.0

> 配套文档:`design-system.md` / `responsive-spec.md`
> 文档版本:2026-06-12 v1.0
> 总工时估算:14-18 个工作日(单人全职)

---

## 0. 路线图总览

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 0 · 准备                                              │
│   ↓ 1 天                                                    │
│ Phase 1 · 基础设施(技术栈升级 + 设计 token)                 │
│   ↓ 2-3 天                                                  │
│ Phase 2 · 通用框架(导航 + 布局 + 登录)                      │
│   ↓ 2 天                                                    │
│ Phase 3 · 首页 Dashboard(重头戏)                            │
│   ↓ 2-3 天                                                  │
│ Phase 4 · 核心业务页(设备/智能体/对话)                       │
│   ↓ 3-4 天                                                  │
│ Phase 5 · 长尾页(配置/开发者/知识库/声纹等)                 │
│   ↓ 2-3 天                                                  │
│ Phase 6 · 联调 + 验收 + 上线                                │
│   ↓ 1-2 天                                                  │
└─────────────────────────────────────────────────────────────┘
```

**核心原则**:
- **每个 Phase 独立可发布**,出问题可回滚
- **每个 Phase 有明确验收**,不模糊交付
- **可中途暂停**,下一阶段接着干

---

## Phase 0 · 准备(0.5-1 天)

### 目标
做开工前最后的对齐,**不写业务代码**,只搭脚手架和确认边界。

### 任务清单
- [ ] **拉新分支** `refactor/v2` 从 `main` 切
- [ ] **跑通现有项目**:确认 `npm install` + `npm run serve` 能起来
- [ ] **梳理后端 API 契约**:从 `manager-api/` 摸清接口,列一张"已用接口"清单
- [ ] **确认依赖版本**:Vue 2.6.14 / Element UI 2.15 / Vue CLI 5
- [ ] **检查 23 个 view 实际内容**:扫一遍源码,标出哪些能直接迁移、哪些需要重写
- [ ] **建好新目录骨架**:
  ```
  src/
  ├── theme/        (空,Phase 1 填)
  ├── composables/  (空)
  ├── views/
  ├── components/
  ├── stores/       (Pinia,空)
  ├── router/
  ├── api/
  ├── assets/
  ├── styles/
  ├── App.vue
  └── main.ts
  ```
- [ ] **装好开发工具**:
  - Vue DevTools 浏览器扩展
  - Vite 调试模式
  - Charles/Whistle 抓包(看后端真实返回)
  - 真机调试(手机 + Pad)

### 验收
- 项目能正常启动,现有 22 个 Dialog + 23 个 view 跑得动
- 新分支提交,CI 通过
- 任务清单全部勾完

### 风险点
- 现有项目跑不起来 → 先修复,不在重构范围内
- 后端 API 不熟悉 → 找人问 / 看文档,避免改坏

---

## Phase 1 · 基础设施(2-3 天)

### 目标
**这是最重要的一步,后续所有页面都依赖它**。把 Vue 2 + Element UI 2 升级到 Vue 3 + Element Plus,搭好设计 token 体系。

### 任务清单

#### 1.1 技术栈升级(1.5 天)
- [ ] **Vue 2 → Vue 3.4+**
  - 用 `@vue/compat` 兼容模式启动,逐步迁移
  - Options API → Composition API(先保持 Options,业务代码按文件粒度迁移)
  - `new Vue()` → `createApp()`
  - 全局事件总线移除 → mitt 或 Pinia
  - `slot="xxx"` → `v-slot:xxx` 或 `#xxx`
  - `v-model` 拆 `:modelValue` + `@update:modelValue`
- [ ] **Vue CLI → Vite 5**
  - 创建 `vite.config.ts`
  - 迁移 `vue.config.js` 配置
  - 配 SCSS / PostCSS / alias
  - 配 `optimizeDeps`(按需 Element Plus)
  - 配 `build.rollupOptions`(代码分割)
- [ ] **Element UI 2 → Element Plus 2.x**
  - 按需引入(用 `unplugin-vue-components`)
  - 主题色 CSS 变量覆盖
  - 全局 message / notification / message-box 改函数式
  - 旧 Icon 替换为 Lucide Icons
- [ ] **Vuex 3 → Pinia 2**
  - 拆 store 模块(暂保留旧 store 兼容)
  - 新代码全部用 Pinia
- [ ] **vue-i18n 8 → 9**
  - Composition API 风格
  - 引入路径调整

#### 1.2 设计 token 体系(0.5 天)
- [ ] 创建 `theme/_breakpoints.scss`
- [ ] 创建 `theme/_colors.scss`(9 档主色 + 9 档辅色 + 中性 + 语义)
- [ ] 创建 `theme/_typography.scss`(8 档字号 + 字重 + 行高)
- [ ] 创建 `theme/_spacing.scss`(4-64 间距)
- [ ] 创建 `theme/_radius.scss`(6/10/16/24/full)
- [ ] 创建 `theme/_shadow.scss`(4 档 + glow)
- [ ] 创建 `theme/_motion.scss`(曲线 + 时长)
- [ ] 创建 `theme/_tokens.scss` 统一 `@use` 入口
- [ ] 创建 `theme/index.scss` 暴露 CSS 变量
- [ ] Element Plus 主题色覆盖为我们的主色
- [ ] `composables/useResponsive.ts`(5 档判断)

#### 1.3 全局样式(0.5 天)
- [ ] `styles/reset.scss`(基于 `normalize.css`,加深一层)
- [ ] `styles/element-overrides.scss`(覆盖 Element Plus 默认值)
- [ ] `styles/global.scss`(全局基础样式)
- [ ] `App.vue` 引入全局样式,挂载主题
- [ ] `prefers-reduced-motion` 全局规则
- [ ] 字体引入(Inter via Google Fonts CDN + PingFang SC 系统字体降级)

#### 1.4 工具(0.5 天)
- [ ] `composables/useBreakpoint.ts`(响应式断点,带防抖)
- [ ] `composables/useTheme.ts`(暗色模式预留,V1 暂不启用)
- [ ] `composables/useToast.ts`(统一 Toast 包装)
- [ ] `composables/useDrawer.ts`(统一 Drawer 打开/关闭)
- [ ] `utils/storage.ts`(localStorage 封装,支持过期时间)
- [ ] `utils/format.ts`(时间、数字、文件大小格式化)
- [ ] `api/index.ts`(axios 封装,统一拦截器、错误处理、JWT)

### 验收 Checklist
- [ ] `npm run dev` 启动 < 1.5s
- [ ] 任意旧页面(如 `home.vue`)改成 `<template>` 套一个空 `<div class="p-4">测试</div>` 能渲染
- [ ] Element Plus 按钮显示为我们的主色(不是默认蓝)
- [ ] `useBreakpoint()` 在 resize 时正确切换断点
- [ ] 5 档断点下,根 `body` 上的 `data-bp` 属性正确
- [ ] 引入一个 Lucide icon 能正常显示
- [ ] 浏览器控制台无 error / warning
- [ ] Lighthouse Performance ≥ 90

### 测试方法
1. **桌面** Chrome 1920x1080 → 缩到 1280 → 1024 → 800,断点类名应跟着变
2. **DevTools 设备模式** 切 iPhone 14 / iPad,断点正确
3. **Element Plus 主题**:打开任一 Button 组件,DevTools 看 `--el-color-primary` 应是 `#4F6BFF`
4. **构建产物**:`npm run build` 成功,`dist/` 内 JS gzip 后 < 500KB
5. **类型检查**:`vue-tsc --noEmit` 无错误

### 风险点
- **Element Plus 部分组件 API 变更** → 查官方迁移指南 + codemod
- **Vite 与 Vue CLI 配置差异** → 不要复制粘贴,逐项映射
- **i18n 9 重大变化** → 先评估,问题大就推迟到 Phase 5

### 回滚方案
- Phase 0 创建的 `refactor/v2` 分支如果崩了,切回 `main`,不影响生产
- 每个子任务用单独 commit,回滚粒度到任务级

---

## Phase 2 · 通用框架(1.5-2 天)

### 目标
搭好"骨架":主布局 + 导航 + 登录/注册。**还没改业务**,只是把"框架"立起来。

### 任务清单

#### 2.1 布局组件(1 天)
- [ ] **`layouts/DefaultLayout.vue`** — 整体布局壳(侧边栏 + 顶栏 + 主区)
- [ ] **`components/layout/SidebarNav.vue`** — 桌面侧边栏(240px,可折叠 64px)
- [ ] **`components/layout/TopBar.vue`** — 顶栏(搜索 / 状态 / 通知 / 头像)
- [ ] **`components/layout/MobileTabBar.vue`** — 手机底部 Tab Bar
- [ ] **`components/layout/PadTopTabs.vue`** — Pad 顶部 Tab
- [ ] **`components/layout/MobileHeader.vue`** — 手机顶栏
- [ ] **响应式切换**:根据 `useBreakpoint()` 自动切换不同导航组件
  - 桌面:SidebarNav + TopBar
  - Pad:PadTopTabs + TopBar
  - 手机:MobileHeader + MobileTabBar
- [ ] **路由改造**:把 23 个 view 全部接入新 layout

#### 2.2 登录 / 注册 / 找回(0.5-1 天)
- [ ] **`views/Login.vue`** — 重做,左右分栏(桌面)/ 居中(Pad)/ 全屏(手机)
- [ ] **`views/Register.vue`** — 同上
- [ ] **`views/RetrievePassword.vue`** — 同上
- [ ] **`components/auth/PasswordInput.vue`** — 密码可见切换封装
- [ ] **`components/auth/FormField.vue`** — 统一表单字段(label + input + 错误信息)
- [ ] **路由守卫**:未登录跳 Login
- [ ] **JWT 拦截器**:401 跳登录

#### 2.3 空状态 / 加载 / 错误(0.5 天)
- [ ] **`components/common/EmptyState.vue`** — 大图标 + 文字 + 主操作
- [ ] **`components/common/LoadingState.vue`** — skeleton / spinner
- [ ] **`components/common/ErrorState.vue`** — 错误 + 重试
- [ ] **`components/common/ConfirmModal.vue`** — 统一确认弹窗

### 验收 Checklist
- [ ] 桌面打开任一页面,左侧深色侧边栏 + 右侧浅色主区,顶栏显示
- [ ] Pad 打开,顶部 Tab 出现,侧边栏隐藏
- [ ] 手机打开,底部 Tab Bar 出现,顶栏极简
- [ ] 切换断点(浏览器缩放 / DevTools 设备模式),导航自动切换
- [ ] 登录页:输入错误密码 → 字段下方红字提示,按钮 loading
- [ ] 登录成功 → 跳转首页
- [ ] 退出登录 → 跳回登录页
- [ ] 空状态组件在大图标 + 文字时表现正确

### 测试方法
1. **响应式切档**:Chrome DevTools 切 5 档尺寸,布局正确
2. **真机测试**:
   - iPhone(Safari):底部 Tab Bar 不被 Home Indicator 遮挡
   - iPad(Safari):顶部 Tab 显示完整
   - Android(Chrome):底部 Tab 正常
3. **登录流程**:正确密码登录、错误密码提示、忘记密码流程
4. **路由守卫**:不登录直接访问 /home → 跳 /login
5. **JWT 过期**:手动改 token → 跳登录

### 风险点
- **侧边栏折叠状态持久化**:用户偏好写 localStorage,刷新保持
- **响应式切换时数据丢失**:避免在 layout 切换时销毁 store 状态
- **iOS Safari 100vh 问题**:用 `100dvh` 或 JS 动态计算

### 回滚方案
- 这一阶段只动 layout + login,业务页面都是空壳
- 任何子组件崩了,临时 fallback 到旧的(分支切换)

---

## Phase 3 · 首页 Dashboard(2-3 天) ⭐ 重头戏

### 目标
这是整个产品的"脸",也是设计语言最集中的体现。**重做首页**,作为其他页面的范本。

### 任务清单

#### 3.1 统计卡组件(0.5 天)
- [ ] **`components/dashboard/StatCard.vue`** — 数字 / 标题 / 趋势 / 副标题
- [ ] 数据 props: number / trend / trendValue / period
- [ ] 大数字 display-1 字号,主色或辅色
- [ ] 趋势图标(Lucide: TrendingUp / Down / Minus)+ 颜色
- [ ] hover: 阴影从 md → lg,数字微缩放

#### 3.2 智能体卡 / 设备卡(0.5 天)
- [ ] **`components/dashboard/AgentCard.vue`** — 智能体卡
  - 头像 / 名称 / 角色标签
  - 今日调用次数
  - 启用状态点
  - hover: 显示快速操作(详情 / 编辑)
- [ ] **`components/dashboard/DeviceCard.vue`** — 设备卡
  - 设备图标 / 名称 / MAC 末 4 位
  - 状态点 + 文字
  - 当前智能体标签
  - 今日对话 + 唤醒次数
  - hover: 显示快速操作

#### 3.3 Dashboard 页面(1-1.5 天)
- [ ] **`views/Home.vue`** — 重写
- [ ] 5 档断点布局(参考 `responsive-spec.md` 章节 3)
- [ ] 问候语 + 服务状态条(顶栏下方)
- [ ] 4 个统计卡(Bento 顶部)
- [ ] 智能体矩阵 + 设备矩阵(Bento 中部)
  - 桌面:2x2 列网格
  - 平板:3 列混合
  - Pad:2 列 + Tab 切换
  - 手机:横滑卡片
- [ ] 实时调用流(底部)
  - 等宽字体
  - 日志级别筛选(全部/INFO/WARN/ERROR)
  - 暂停/继续/清空/导出
  - WebSocket 实时数据(暂用 mock,Phase 6 接真实)

#### 3.4 数字人 Tab 切换(0.5 天)
- [ ] 顶部 Tab:数据模式 / 数字人模式
- [ ] 数字人模式复用 `digital-human/index.html`(iframe 或直接组件化)
- [ ] 切换动画(淡入淡出 240ms)

### 验收 Checklist
- [ ] 桌面 1920x1080:4 个统计卡横排 + 矩阵 2x2 + 实时流
- [ ] 桌面 1280x1024:同 1920 但更紧凑
- [ ] 平板 1024:3 列 + 实时流右栏
- [ ] Pad 800:2 列堆叠 + Tab 切换智能体/设备
- [ ] 手机 375:2x2 统计 + 横滑卡片 + 折叠实时流
- [ ] 切档无破版、无错位、无横向滚动
- [ ] 实时流接收 mock 数据,自动滚动到底部
- [ ] 智能体/设备卡 hover 显示快速操作
- [ ] 点击进详情(Drawer,先做空 Drawer + 标题)
- [ ] 数字人 Tab 切换流畅

### 测试方法
1. **5 档断点截图** 对比设计稿(我自己根据 `responsive-spec.md` 画一份 ASCII 视觉稿)
2. **iPhone 真机测试**:横滑卡片滑动顺畅,WebSocket 持续连接
3. **iPad 真机测试**:横屏/竖屏都正确
4. **Lighthouse 移动端评分**:Performance ≥ 85,Accessibility ≥ 95
5. **键盘操作**:Tab 键能在所有可交互元素间切换,focus 状态可见
6. **屏幕阅读器**(VoiceOver / NVDA):统计卡数字能被读出,卡的功能能被理解

### 风险点
- **Bento Grid 实现**:用 CSS Grid,避免依赖第三方库
- **WebSocket 在切档时不断开**:Pinia 集中管理连接
- **横滑卡片性能**:用 `overflow-x: auto` + `scroll-snap`,不引第三方 swiper

### 验证结论 → 是否继续 Phase 4
- ✅ 通过 → 进 Phase 4
- ⚠️ 局部问题 → 修,2 小时内修完进 Phase 4
- ❌ 大问题 → 暂停,重新审设计,可能调 design-system.md

---

## Phase 4 · 核心业务页(3-4 天)

### 目标
把"首页范本"复用到设备、智能体、对话三个高频页面。**Drawer 模式正式启用**。

### 任务清单

#### 4.1 设备管理(1.5 天)
- [ ] **`views/DeviceManagement.vue`** — 表格(桌面) / 卡片(Pad) / 列表(手机)
- [ ] **`components/device/DeviceTable.vue`** — 桌面表格
- [ ] **`components/device/DeviceCardGrid.vue`** — Pad 卡片网格
- [ ] **`components/device/DeviceCardList.vue`** — 手机列表
- [ ] **`components/device/AddDeviceDrawer.vue`** — 4 组字段分组(决策 3 = C)
- [ ] **`components/device/DeviceDetailDrawer.vue`** — 5 Tab(基础/智能体/网络/OTA/日志)
- [ ] **扫一扫功能**(ZXing 库集成)
- [ ] **批量操作**(多选 + 批量改标签/删除)

#### 4.2 智能体管理(1 天)
- [ ] **`views/AgentManagement.vue`** — 三端列表
- [ ] **`components/agent/AgentCard.vue`** / `AgentTable.vue` / `AgentList.vue`
- [ ] **`components/agent/AddAgentDrawer.vue`** — 基础 + 知识 + 工具 + 声音 + 记忆
- [ ] **`components/agent/AgentQuickTest.vue`** — 桌面 Drawer 内嵌测试区
- [ ] **`views/AgentQuickTestFull.vue`** — 手机端全屏测试页
- [ ] **`components/agent/TemplateMarket.vue`** — 模板市场(独立组件)

#### 4.3 对话记录(1 天)
- [ ] **`views/ChatHistory.vue`** — 桌面/Pad 左侧列表 + 右侧消息流
- [ ] **`views/ChatList.vue`** — 手机端独立列表
- [ ] **`views/ChatDetail.vue`** — 手机端独立消息流
- [ ] **`components/chat/SessionList.vue`** — 会话列表
- [ ] **`components/chat/MessageStream.vue`** — 消息流
- [ ] **`components/chat/MessageBubble.vue`** — 消息气泡(用户/智能体/工具调用/错误)
- [ ] **`components/chat/AudioPlayer.vue`** — 音频消息播放
- [ ] **搜索**:全文搜索 / 按时间 / 按设备

#### 4.4 麦克风唤醒(0.5 天)
- [ ] **`components/voice/MicButton.vue`** — 桌面/Pad 长按版
- [ ] **`components/voice/VoiceOverlay.vue`** — 手机全屏沉浸
- [ ] **`components/voice/Waveform.vue`** — 实时波形(Canvas)
- [ ] **状态机**:Idle/Recording/Processing/Speaking/Cancelled/Error(参考 `responsive-spec.md` 8.2)
- [ ] **Live2D 联动**:基本表情切换(预留接口,接 Cubism SDK)
- [ ] **Web Speech API** 兜底 / **MediaRecorder** 主路径

### 验收 Checklist(每个页面单独)
- [ ] 表格列对齐 / 卡片对齐 / 列表对齐
- [ ] Drawer 桌面 720 / Pad 480 / 手机全屏,三端一致行为
- [ ] 添加表单字段校验(必填、格式、长度)
- [ ] 列表加载 > 100 条不卡(虚拟滚动)
- [ ] 详情页所有 Tab 可访问
- [ ] 对话记录:消息气泡样式正确(用户右、助手左)
- [ ] 工具调用消息可展开/折叠
- [ ] 麦克风:手机全屏 + 上滑取消 + 状态机正确
- [ ] 麦克风:桌面长按 + 小气泡弹出

### 测试方法
1. **Drawer 三态切换**:同一 Drawer 在 5 档断点下,宽度自动调
2. **表单校验**:必填 / 格式错误 / 长度超限
3. **大数据列表**:mock 1000 条数据,滚动 FPS ≥ 50
4. **麦克风权限**:首次进页 → 系统弹窗 → 同意后能录音
5. **Live2D 联动**:说话时模型头部轻微动(无 Live2D 时降级为图标)
6. **真机录音**:iPhone Safari + Android Chrome 都试

### 风险点
- **MediaRecorder 浏览器兼容**:Safari iOS 14+ / Chrome Android 60+
- **波形性能**:Canvas 重绘不能阻塞 UI
- **Live2D Cubism 体积**:按需加载,不阻塞首屏
- **Drawer 内嵌 QuickTest 性能**:WebSocket + Live2D 同跑,可能掉帧

### 回滚方案
- 每个页面单独分支 → 单独可回滚
- 旧 view 文件保留(改名 `*.old.vue`),新 view 出问题快速切换

---

## Phase 5 · 长尾页(2-3 天)

### 目标
收尾剩余的 12-15 个 view,统一应用设计语言。

### 任务清单

#### 5.1 系统配置(0.5 天)
- [ ] `views/Settings.vue` — 左侧导航 + 右侧表单
- [ ] 4 个分组:服务 / 默认参数 / 通知 / 关于

#### 5.2 开发者(0.5 天)
- [ ] `views/Developer.vue` — API Token / WS 测试 / MQTT 下发
- [ ] `views/MqttCommandDrawer.vue`
- [ ] 桌面专用 Tab,Pad 简化,手机收"我的"

#### 5.3 知识库(0.5 天)
- [ ] `views/KnowledgeBaseManagement.vue`
- [ ] `views/KnowledgeBaseItem.vue` — 文档列表
- [ ] `views/KnowledgeFileUpload.vue` — 上传 + 进度
- [ ] `views/RagTest.vue` — RAG 问答测试

#### 5.4 声纹 / TTS / 音色(0.5 天)
- [ ] `views/VoicePrintManagement.vue`
- [ ] `views/VoiceResourceManagement.vue`
- [ ] 声纹注册向导(4 步骤)

#### 5.5 其他(0.5 天)
- [ ] `views/AddressBookManagement.vue`
- [ ] `views/ParamsManagement.vue`
- [ ] `views/ReplacementWordManagement.vue`
- [ ] `views/DictManagement.vue`
- [ ] `views/OtaManagement.vue`
- [ ] `views/FeatureManagement.vue`
- [ ] `views/UserManagement.vue` / `RoleConfig.vue`

### 验收
- 所有 23 个 view 都已迁移到 Vue 3 + Element Plus + 新设计语言
- 旧组件目录完全移除(无 `*.old.vue` 残留)
- 全站无 Element UI 2 残留依赖

### 测试方法
- 完整遍历 23 个 view 截图
- 全局 lint + type check 通过
- 整体 e2e 走一遍(如果有 Playwright 测试)

---

## Phase 6 · 联调 + 验收 + 上线(1-2 天)

### 目标
真实数据接入、性能调优、上线准备。

### 任务清单

#### 6.1 联调(0.5 天)
- [ ] **WebSocket 真实接入**:替换 mock
- [ ] **REST API 全量验证**:每个 view 至少跑通 1 个真实接口
- [ ] **错误处理**:网络断 / 5xx / 4xx 都有合理 UI
- [ ] **JWT 刷新**:401 自动 refresh 或重新登录
- [ ] **多设备联调**:至少 3 个真实设备连上后,矩阵卡能显示

#### 6.2 性能(0.5 天)
- [ ] **代码分割**:每个 view 路由懒加载
- [ ] **图片优化**:WebP + lazy load
- [ ] **Bundle 分析**:`vite-bundle-visualizer`,主 chunk < 500KB
- [ ] **Lighthouse 全跑**:Performance / Accessibility / Best Practices / SEO
  - Performance ≥ 90
  - Accessibility ≥ 95
  - Best Practices ≥ 90
- [ ] **Web Vitals**:LCP < 2.5s, FID < 100ms, CLS < 0.1

#### 6.3 验收(0.5 天)
- [ ] **设计走查**:自己逐页对照 `design-system.md` 验
- [ ] **a11y 走查**:`a11y-checklist.md`(待出)
- [ ] **三端截图归档**:每端每个 view 一张截图
- [ ] **回归测试**:核心流程(登录 / 添加设备 / 对话 / OTA)能跑通

#### 6.4 上线(0.5 天)
- [ ] **合并 `refactor/v2` → `main`**
- [ ] **打 tag**:`v2.0.0`
- [ ] **更新 README**:加重构说明
- [ ] **发 release note**:列出 breaking changes
- [ ] **Docker 镜像**:`Dockerfile-web` 重新构建并推送

### 验收 Checklist
- [ ] 全站 5 档断点无破版
- [ ] 所有功能与旧版一致
- [ ] 性能指标达标
- [ ] 可访问性达标
- [ ] 无控制台 error / warning
- [ ] Git tag 打好,Docker 镜像推好
- [ ] README 更新好

---

## 1. 总工时与里程碑

| Phase | 天数 | 累计 | 里程碑 |
|---|---|---|---|
| 0 | 0.5-1 | 1 | 新分支就绪,旧项目跑得动 |
| 1 | 2-3 | 4 | **技术栈升级 + token 体系完成** |
| 2 | 1.5-2 | 6 | **骨架立起来,登录能跑** |
| 3 | 2-3 | 9 | **首页 Dashboard 完工** ⭐ |
| 4 | 3-4 | 13 | **核心业务页完工** ⭐ |
| 5 | 2-3 | 16 | **全站迁移完成** |
| 6 | 1-2 | 18 | **上线** |

**乐观 14 天,悲观 18 天**(含联调与缓冲)。

---

## 2. 验证策略(贯穿所有 Phase)

### 2.1 每个 Phase 都有"通过标准"
不接受"看起来差不多就行"。每个 Phase 的验收 Checklist 必须**逐项勾完**。

### 2.2 自动化测试
- **Phase 3 起**:关键组件写 Vitest 单元测试
  - `StatCard` / `MessageBubble` / `VoiceOverlay` 状态机
  - 测试覆盖率 ≥ 60%(组件级)
- **Phase 4 起**:核心流程写 Playwright e2e
  - 登录 → 添加设备 → 查看对话
  - 切档测试(5 档断点)
- **Phase 5 起**:全站 e2e + 视觉回归

### 2.3 真机测试矩阵
- iPhone(Safari + Chrome)
- iPad Mini(Safari)
- Android 中端机(Chrome)
- 桌面 Chrome / Edge / Safari

**每完成一个 Phase 必跑一次真机**,不是只在模拟器里测。

### 2.4 性能基线
- 首屏: < 1.5s
- 包大小: 主 chunk gzip < 500KB
- Lighthouse: Perf ≥ 90, A11y ≥ 95
- WebSocket 重连: < 3s

### 2.5 上线前必须
- [ ] 所有 Phase 6 验收勾完
- [ ] 至少 1 个真机走过核心流程
- [ ] 至少 1 个同事/朋友体验过
- [ ] 自己断网测试过(看到错误态正确)
- [ ] 旧版备份(必要时可回滚)

---

## 3. 风险登记

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| Element Plus 升级踩坑 | 中 | 高 | 用 codemod + 保留旧代码兼容 |
| Vite + Vue 2 兼容模式出问题 | 中 | 中 | 必要时直接 Options API → Composition 一次到位 |
| i18n 9 重大变化 | 低 | 中 | 推迟到 Phase 5 解决 |
| MediaRecorder 兼容 | 中 | 中 | 提供 Web Speech API 兜底 |
| Live2D 性能差 | 中 | 低 | 按需加载 + 降级为图标 |
| 真实设备联调出问题 | 中 | 高 | Phase 6 留充足时间,可推迟发布 |
| 旧 view 改不动 | 中 | 中 | 改用 Pinia 集中状态,逐步替换 |

---

## 4. 协作与沟通

### 4.1 单人项目
- 每个 Phase 完成后,自己给自己写个 **Phase 总结**(改了哪些 / 遇到什么坑 / 还有什么没做)
- 写 changelog(中文,放 docs/CHANGELOG.md)
- 重要的设计决策记在 ADRs(Architecture Decision Records)

### 4.2 多人项目(如后续拉人)
- 每天站会(线上也行):昨天 / 今天 / 阻塞
- 每个 Phase 结束做 demo(录个 5 分钟视频也行)
- 评审用 PR + 截图

---

## 5. 不做的事(明确范围)

为了让路线图可控,**以下内容明确不在本次重构范围**:

- ❌ 暗色模式(预留 token,V1 不实现)
- ❌ 国际化新增语言(中英繁简保留,其他不增)
- ❌ 移动端原生 App(还是 PWA 思路,不做 RN/Flutter)
- ❌ 离线完整支持(只做基础提示)
- ❌ 后端 manager-api 改动
- ❌ 数据库结构改动
- ❌ 旧版回退兼容(旧 view 全部删除,不并存)
- ❌ E2E 覆盖率到 100%(只覆盖核心流程)

如果某天你觉得"这个也要做",那是一个**新项目**,不是这次重构的一部分。

---

## 6. 启动建议

**先做 Phase 0,半天搞定**:
1. 切分支
2. 跑起来
3. 看一眼现有 23 个 view 的真实状态
4. 跟我们讨论的规范做一次**对照**——看有没有现实跟规范不符的地方

跑通了,我们就正式进 Phase 1。
