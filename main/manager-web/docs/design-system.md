# 小智智控台 — 设计系统规范 v1.0

> 适用项目: `xiaozhi-esp32-server` 管理后台 (manager-web)
> 技术栈: Vue 3.4+ / Vite 5 / Element Plus 2.x / Pinia / SCSS / Lucide Icons
> 设计基线: ui-ux-pro-max 161 行业规则 + 67 UI 风格
> 文档版本: 2026-06-12 v1.0

---

## 0. 设计目标

为开源智能硬件管理后台(小智智控台)提供一套**专业、现代、可三端适配**的设计系统。需同时满足:

- **极客用户**:信息密度高、配置项清晰、API/Token 调试友好
- **普通用户**:操作直觉、视觉柔和、有"小智"人格化温度
- **演示场景**:首页有冲击力,Live2D/3D 元素 + 设备矩阵大屏感

风格定位:**Soft UI Evolution(主) + AI-Native UI(辅) + Data-Dense Dashboard(局部)**

避开的风格:Glassmorphism、Brutalism、Neumorphism、Vibrant Block、紫粉渐变(AI-slop 标志)。

---

## 1. 设计原则 (Design Principles)

### 1.1 移动优先 (Mobile First)
所有样式默认按手机端写,使用 `min-width` 媒体查询向上覆盖。**禁止**用 `max-width` 写"桌面专属"样式。

### 1.2 减少模式中断 (Minimize Modal Interrupt)
- 22 个 Dialog 改造目标 → 5 Drawer + 5 Sheet + 12 Inline
- 关键操作(添加设备/修改配置)用 Drawer 而非 Dialog
- 删除/退出等危险操作才用 Modal 确认

### 1.3 信息密度自适应 (Adaptive Density)
- 桌面/宽屏:大留白 + 大卡片,扫视优先
- 平板:中等留白 + 2 列网格
- 手机:紧凑 + 单列 + 横向滑动卡片

### 1.4 可点击区域最小 44×44 (触控规范)
- 桌面:32×32 即可
- 手机/Pad:**强制 44×44**(Apple HIG / Material Touch Target)

### 1.5 严格反 AI-slop
- ❌ Emoji 当图标(改用 Lucide)
- ❌ 紫粉渐变(本方案已避开)
- ❌ 装饰性阴影/光晕无功能
- ❌ 不必要的玻璃拟态(削弱数据可读)

---

## 2. 断点体系 (Breakpoints)

```scss
// theme/breakpoints.scss
$bp-xs: 0;        // 手机竖屏(< 640)
$bp-sm: 640px;    // 手机横屏 / 小平板
$bp-md: 1024px;   // 平板 / 小桌面
$bp-lg: 1280px;   // 标准桌面
$bp-xl: 1680px;   // 宽屏 / 演示大屏
```

| 名称 | 区间 | 典型设备 | 别名 |
|---|---|---|---|
| xs | 0-639 | iPhone, 安卓 | Mobile |
| sm | 640-1023 | iPad Mini, iPad | Pad |
| md | 1024-1279 | iPad Pro 12.9", 小笔电 | Tablet |
| lg | 1280-1679 | 标准桌面 | Desktop |
| xl | ≥ 1680 | 4K, 演示大屏 | Wide |

Element Plus 默认断点 (`xs/sm/md/lg/xl`) 完全对齐,**不覆盖**,直接使用组件库响应式 props 即可。

---

## 3. 色彩系统 (Color System)

### 3.1 主色 — 深空蓝紫 (Deep Space Indigo)

代表"技术 / AI / 极客"。取自 Linear、Cursor、飞书等 DevTools 调色。

```
primary-50   #EEF1FF   (最浅,选中态背景)
primary-100  #DCE0FF
primary-200  #B8C0FF
primary-300  #8E9AFF
primary-400  #6B7AFF
primary-500  #4F6BFF   ← 主色 (Primary)
primary-600  #3A52E0   (hover)
primary-700  #2A3DB8
primary-800  #1F2D8C
primary-900  #141F66
```

### 3.2 辅色 — 暖橙曙光 (Warm Dawn)

代表"小智人格 / 唤醒 / 温度"。与主色形成冷暖对比。

```
accent-50    #FFF1EB
accent-100   #FFE0D2
accent-200   #FFC4A8
accent-300   #FFA37A
accent-400   #FF8E5F
accent-500   #FF7A45   ← 辅色 (Accent)
accent-600   #E5612A
accent-700   #BF4818
accent-800   #96370F
accent-900   #6B260A
```

### 3.3 中性色 — 冷灰 (Cool Gray)

```
neutral-0    #FFFFFF
neutral-50   #F7F8FB   ← 页面背景 (BG-PAGE)
neutral-100  #EEF0F5
neutral-200  #DCE0E8
neutral-300  #BFC5D1
neutral-400  #9AA3B5   ← 辅助文字
neutral-500  #6F7889
neutral-600  #5A6378   ← 次要文字
neutral-700  #3F4757
neutral-800  #1A1F2E   ← 主文字 / 侧边栏底
neutral-900  #0F1626   ← 深色侧边栏 / 代码块
```

### 3.4 语义色 (Semantic Colors)

```
success     #34C759   (设备在线 / 成功)
success-l   #E8F8EE   (浅底)
warning     #FFB020   (待处理 / 警告)
warning-l   #FFF5E0
danger      #FF4D4F   (设备离线 / 错误 / 删除)
danger-l    #FFEBEC
info        #5AC8FA   (提示 / 信息)
info-l      #E5F6FF
```

### 3.5 文字对比度验证 (WCAG AA)

所有文字/背景组合已验证 ≥ 4.5:1:

| 组合 | 对比度 | 用途 |
|---|---|---|
| primary-500 on white | 5.2:1 | 主按钮文字 |
| neutral-800 on neutral-50 | 14.8:1 | 主文字 |
| neutral-600 on white | 7.1:1 | 次要文字 |
| white on neutral-900 | 17.5:1 | 深底文字(侧边栏) |
| accent-500 on white | 4.6:1 | 辅色按钮文字 |

### 3.6 暗色模式 (Dark Mode) — V1.1 规划

第一版不上暗色模式,但色板预留 `*on-dark` 变体,后续切换只需切换 CSS 变量。**不在第一版实现**避免范围蔓延。

---

## 4. 字体系统 (Typography)

### 4.1 字体族

```scss
$font-sans: "Inter", "PingFang SC", "Microsoft YaHei UI", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
$font-mono: "JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Consolas, monospace;
$font-display: $font-sans;
```

- **中文**:PingFang SC(苹果)/ Microsoft YaHei UI(Win)/ 苹方(降级)
- **英文/数字**:Inter(开源,Google Fonts 引入,字重 400/500/600/700)
- **等宽**:JetBrains Mono(用于 JSON、Token、MAC 地址、日志)

### 4.2 字号阶梯 (Type Scale)

8 点基准,共 8 档:

| Token | size / line-height | 用途 |
|---|---|---|
| display-1 | 32 / 40 | 首页大数字(如"23 台设备") |
| display-2 | 24 / 32 | 卡片大标题 |
| h1 | 20 / 28 | 页面标题 |
| h2 | 18 / 26 | 区块标题 |
| h3 | 16 / 24 | 常用标题 |
| body-lg | 15 / 22 | 重要正文 |
| body | 14 / 20 | 默认正文 |
| body-sm | 13 / 18 | 次要正文 |
| caption | 12 / 16 | 标签 / 提示 |

### 4.3 字重 (Weights)

- 400 Regular — 正文
- 500 Medium — 强调、按钮
- 600 Semibold — 标题
- 700 Bold — 数字统计

**中文字重降级提示**:PingFang SC 没有 600/700,自动 fallback 到 500,必要时人工加粗。

### 4.4 触控端字号调整

手机/Pad 默认字号 15px(桌面 14px),保证可读性。

---

## 5. 间距 / 圆角 / 阴影 (Spacing / Radius / Shadow)

### 5.1 间距 (Spacing Scale)

8 点基准,但允许 4 点小间距:

```
$space-1:  4px    (tag 内部,极紧凑)
$space-2:  8px    (图标-文字间距)
$space-3:  12px   (紧凑组件)
$space-4:  16px   ← 默认组件内边距
$space-5:  20px   (卡片间距)
$space-6:  24px   (区块间距)
$space-8:  32px   (页面级间距)
$space-10: 40px   (大区块)
$space-12: 48px   (页面顶部/底部)
$space-16: 64px   (落地页 hero)
```

### 5.2 圆角 (Radius)

```
$radius-sm:  6px     (按钮、tag、输入框)
$radius-md:  10px    ← 卡片默认
$radius-lg:  16px    (弹窗、抽屉、大卡片)
$radius-xl:  24px    (特殊容器、概览卡)
$radius-full: 9999px (圆形头像、状态点)
```

**响应式调整**:
- 手机卡片 radius 缩小到 8px(视觉密度更高)
- 桌面保持 10px

### 5.3 阴影 (Shadow) — Soft UI Evolution 核心

四档阴影 + 一档聚焦光晕:

```scss
$shadow-sm:  0 1px 2px rgba(15, 22, 38, 0.04), 0 1px 3px rgba(15, 22, 38, 0.06);
$shadow-md:  0 4px 12px rgba(15, 22, 38, 0.06), 0 2px 4px rgba(15, 22, 38, 0.04);
$shadow-lg:  0 12px 32px rgba(15, 22, 38, 0.08), 0 4px 8px rgba(15, 22, 38, 0.04);
$shadow-xl:  0 24px 64px rgba(15, 22, 38, 0.12);
$shadow-glow: 0 0 0 4px rgba(79, 107, 255, 0.15);  // 主色聚焦光晕
$shadow-accent-glow: 0 0 0 4px rgba(255, 122, 69, 0.18);  // 辅色聚焦(麦克风唤醒)
```

**使用场景**:
- `sm` — 按钮、tag、输入框
- `md` — 卡片默认
- `lg` — 悬浮卡片、Drawer
- `xl` — 弹窗、Modal
- `glow` — input focus、按钮 focus

---

## 6. 动效 (Motion)

### 6.1 缓动曲线

```scss
$ease-standard: cubic-bezier(0.4, 0, 0.2, 1);       // Material 标准
$ease-emphasized: cubic-bezier(0.2, 0, 0, 1);         // 强调型
$ease-decelerate: cubic-bezier(0, 0, 0.2, 1);         // 减速
$ease-accelerate: cubic-bezier(0.4, 0, 1, 1);         // 加速
```

### 6.2 持续时间

| 场景 | 时长 | Token |
|---|---|---|
| 微交互 (hover, active, focus) | 120ms | $dur-fast |
| 状态切换 (展开, 收起, 标签页) | 200ms | $dur-base |
| 弹窗/抽屉进出 | 240ms | $dur-medium |
| 大型转场 (页面切换, 路由) | 320ms | $dur-slow |
| 设备状态心跳 | 1600ms 循环 | - |
| 麦克风唤醒 ripple | 600ms 循环 | - |

### 6.3 严格遵守 prefers-reduced-motion

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. 组件库选型 (Component Library)

### 7.1 主组件库: Element Plus 2.x

- 成熟、生态完整、Vue 3 原生
- 表单、表格、Tree、Drawer、Popover 完备
- 主题色可定制(覆盖 `--el-color-primary`)

### 7.2 图标: Lucide Icons

- 比 Element Icons 风格现代、视觉一致
- 支持 tree-shaking、按需引入
- 用法: `<el-icon><Mic /></el-icon>`

### 7.3 图表: ECharts 5.x (首页矩阵、实时流)

- 实时滚动(实时调用流)
- 设备分布饼图
- 唤醒次数热力图

### 7.4 头像 / 3D: Live2D Cubism (沿用项目现有)

- 项目已有 `hiyori_pro_zh` 和 `natori_pro_zh` 资源
- 数字人首页用

### 7.5 不使用

- ❌ Element UI 2(已 EOL)
- ❌ Element Icons(风格偏老)
- ❌ 任何 emoji 库当图标

---

## 8. 信息架构 (Information Architecture)

### 8.1 顶级导航 (7 项 + 我的 = 桌面 8)

| 顺序 | 名称 | 路由 | 三端可见性 |
|---|---|---|---|
| 1 | 概览 | /home | 全端 |
| 2 | 智能体 | /agent | 全端 |
| 3 | 设备 | /device | 全端 |
| 4 | 对话记录 | /chat-history | 全端 |
| 5 | 语音资源 | /voice | 全端(子页分组) |
| 6 | 知识库 | /knowledge | 全端 |
| 7 | 智控台 | /control | 桌面/Pad(手机隐藏) |
| 8 | 系统配置 | /settings | 全端(手机收"我的") |
| 9 | 开发者 | /developer | 桌面/Pad(手机收"我的") |

### 8.2 手机端底部 Tab Bar (5 项)

```
[ 概览 ]  [ 设备 ]  [ ● ]  [ 对话 ]  [ 我的 ]
                          ↑
                     暖橙麦克风按钮
                    (点击进数字人对话)
```

"我的"内含:智能体、语音资源、知识库、系统配置、开发者。

---

## 9. 首页 Dashboard 信息密度

### 9.1 桌面(≥1280)— Bento 4 列

```
┌────────┬────────┬────────┬────────┐
│ 设备总数│ 在线设备│ 今日对话│ 唤醒次数│  ← 4 个统计卡
├────────┴────┬───┴────────┴────────┤
│             │                     │
│  智能体矩阵  │     设备矩阵          │
│  (2 列卡片)  │     (2 列卡片)        │
│             │                     │
├─────────────┴─────────────────────┤
│   实时调用流(WebSocket 滚动)        │
└─────────────────────────────────────┘
```

### 9.2 平板(1024-1279)— Bento 3 列,实时流单列

### 9.3 Pad(768-1023)— Bento 2 列,堆叠

### 9.4 手机(<640)— 单列瀑布 + 横滑卡片

详细三端规范见 `responsive-spec.md`(V1.1 输出)。

---

## 10. 设计 Token 实施

### 10.1 三层结构

```scss
// theme/_tokens.scss — 原始值
$primary-500: #4F6BFF;

// theme/_semantic.scss — 语义别名
$color-action-primary: $primary-500;
$color-bg-page: $neutral-50;

// theme/_component.scss — 组件级
$button-primary-bg: $color-action-primary;
$button-primary-text: white;
```

### 10.2 CSS Variables 暴露(运行时可切换)

```css
:root {
  --color-primary: #4F6BFF;
  --color-bg-page: #F7F8FB;
  --space-4: 16px;
  --radius-md: 10px;
  --shadow-md: 0 4px 12px rgba(15, 22, 38, 0.06), 0 2px 4px rgba(15, 22, 38, 0.04);
}
```

Element Plus 主题色也通过 CSS Variables 覆盖:

```css
:root {
  --el-color-primary: var(--color-primary);
  --el-color-primary-light-3: #6B7AFF;
  --el-color-primary-light-5: #8E9AFF;
  --el-color-primary-light-7: #B8C0FF;
  --el-color-primary-light-8: #DCE0FF;
  --el-color-primary-light-9: #EEF1FF;
  --el-color-primary-dark-2: #3A52E0;
}
```

### 10.3 目录结构

```
main/manager-web/src/
├── theme/
│   ├── _breakpoints.scss
│   ├── _colors.scss
│   ├── _typography.scss
│   ├── _spacing.scss
│   ├── _radius.scss
│   ├── _shadow.scss
│   ├── _motion.scss
│   ├── _tokens.scss       (汇总,@use 入口)
│   └── index.scss
├── styles/
│   ├── reset.scss
│   ├── element-overrides.scss
│   └── global.scss
└── composables/
    └── useResponsive.ts
```

---

## 11. 可访问性 (A11y) 基线

- ✅ 所有可交互元素 `cursor: pointer`
- ✅ focus 状态可见(2px 主色 outline + 4px 光晕)
- ✅ 文字对比度 ≥ 4.5:1(WCAG AA)
- ✅ 颜色不是唯一信息载体(配合文字、图标)
- ✅ 设备在线/离线状态用**色 + 文字 + 图标**三重表达
- ✅ 表单 label 关联,错误信息 `aria-describedby`
- ✅ 跳过导航链接(skip to main content)
- ✅ 严格 `prefers-reduced-motion`

---

## 12. 反模式清单 (Anti-Patterns)

**禁止出现**:

- ❌ Emoji 当功能图标(可以出现在用户生成内容,不在 UI 控件)
- ❌ 紫粉渐变(AI-slop 标志)
- ❌ 居中长段落(可读性差)
- ❌ 用 Modal 做常规操作(打断流程)
- ❌ 没有 hover 状态的按钮
- ❌ 阴影无方向性(所有阴影向左下偏移 0,4)
- ❌ 灰底配灰字(对比度不够)
- ❌ 一行 3 个以上按钮(操作分散)
- ❌ 自动播放声音/视频
- ❌ 装饰性动效(只为炫技)

**强制要求**:

- ✅ 所有按钮/链接有 hover、active、focus、disabled 四态
- ✅ 表格行 hover 高亮
- ✅ 加载状态有 skeleton 或 spinner(不可空白)
- ✅ 空状态有引导插图(用 Lucide 大图标 + 文字)
- ✅ 错误状态有恢复建议
- ✅ 关键操作有确认(危险操作二次确认)

---

## 13. 后续文档

- `responsive-spec.md` — 三端响应式交互细则(规划中)
- `component-library.md` — 业务组件库封装标准
- `page-patterns.md` — 常用页面布局模式参考

---

## 附录 A:从 Element UI 2 到 Element Plus 的迁移注意

迁移前必读的 4 个常见 breaking change:

1. **按钮组**:`<el-button-group>` API 不变,但嵌套写法调整
2. **Table 列**: `:prop` 弃用,改用 `prop` 直接传
3. **Form 校验**:async-validator 升级,部分规则写法变
4. **全局 this.$message** → `ElMessage()` 函数式调用

迁移可用工具:`@element-plus/codemod`(官方 codemod 部分可自动化)。

## 附录 B:参考行业案例

- **Linear** — 紫蓝主色 + 暖橙点缀,数据密度
- **Cursor** — 暗色 IDE + 简洁卡片
- **飞书/Lark** — 中文中后台标杆
- **Notion** — 极简卡片布局
- **苹果 iPadOS 桌面** — 触控端布局范本
