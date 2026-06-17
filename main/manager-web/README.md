# 小智智控台 v2 (manager-web)

> 前端 v2 重构版 — Vue 3 + Vite + TypeScript + Element Plus

主项目介绍: [根 README](../../README.md) · 部署文档: [Deployment.md](../../xiaozhi-server/docs/Deployment.md)

---

## v2 简介

基于 [ui-ux-pro-max](https://uupm.cc) 设计规范全面重写,使用 Vue 3.5 + Vite 5 + Element Plus 2.8 + TypeScript。

**核心特性**:
- 🎨 完整设计 token 体系(色板/字号/间距/动效/阴影)
- 📱 4 档响应式(mobile / pad / tablet / desktop)
- 🔄 真实后端联调(`xiaozhi-esp32-server-web` Docker 镜像)
- 🧩 6 大核心页面 + 5 个高频设置页
- 🎤 麦克风唤醒状态机(6 状态)
- 📊 实时调用流 + Mock 数据

**详细**: 见 [docs/design-system.md](docs/design-system.md) 和 [CHANGELOG.md](CHANGELOG.md)

---

## 开发

### 环境要求
- Node.js ≥ 18
- npm ≥ 9

### 安装
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
打开 http://localhost:5173

### 构建生产包
```bash
npm run build
```

### 类型检查
```bash
npm run type-check
```

---

## 后端联调

默认 Vite 代理 `/xiaozhi/*` 到 `http://127.0.0.1:8002`(同机器跑后端)。

**启动后端**(推荐 Docker 方式):
```bash
cd ../xiaozhi-server
docker compose -f docker-compose.dev.yml up -d
```

等所有容器 `healthy` 后,后端 API 在 `http://localhost:8002`。

**默认账号**: 通过 http://localhost:8002 智控台注册新账号,或 `admin / admin` (如果后端初始化时设置)。

---

## 目录结构

```
manager-web/
├── src/
│   ├── api/                # axios 封装 + 接口
│   ├── components/         # 通用组件 + 业务组件
│   │   ├── common/         # Empty/Loading/Error
│   │   ├── dashboard/      # StatCard/AgentCard/DeviceCard/LiveStream
│   │   ├── device/         # 设备管理相关
│   │   ├── agent/          # 智能体相关
│   │   ├── chat/           # 对话相关
│   │   ├── voice/          # 麦克风/语音
│   │   └── settings/       # 通用设置布局
│   ├── composables/        # 复用 composables
│   ├── layouts/            # 布局壳 + 4 种导航
│   ├── router/             # 路由(Vue Router 4)
│   ├── stores/             # Pinia 状态
│   ├── styles/             # 全局样式 + tokens + overrides
│   ├── theme/              # 设计 token (SCSS)
│   ├── utils/              # 工具函数
│   ├── views/              # 页面级组件
│   ├── App.vue
│   └── main.ts
├── docs/                   # 设计文档 + 阶段报告
│   ├── design-system.md
│   ├── responsive-spec.md
│   ├── refactor-roadmap.md
│   ├── phase-0-report.md
│   ├── phase-2-report.md
│   └── phase-3-report.md
├── public/                 # 静态资源
├── index.html              # Vite 入口
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TS 配置
├── package.json
└── CHANGELOG.md
```

---

## 文档

| 文档 | 用途 |
|---|---|
| [docs/design-system.md](docs/design-system.md) | 完整设计系统规范(色板/字体/间距/动效) |
| [docs/responsive-spec.md](docs/responsive-spec.md) | 三端响应式布局与交互细则 |
| [docs/refactor-roadmap.md](docs/refactor-roadmap.md) | v2 重构 6 阶段路线图 |
| [docs/phase-0-report.md](docs/phase-0-report.md) | 项目勘察报告 |
| [docs/phase-2-report.md](docs/phase-2-report.md) | Phase 2 验收报告 |
| [docs/phase-3-report.md](docs/phase-3-report.md) | Phase 3 验收报告 |
| [CHANGELOG.md](CHANGELOG.md) | 版本更新日志 |

---

## 浏览器兼容

- Chrome / Edge ≥ 90
- Safari ≥ 15 (iOS 15+)
- Firefox ≥ 90

需要 `WebSocket` / `MediaRecorder` / `Web Audio API` 等现代浏览器 API。

---

## License

MIT(继承上游协议)
