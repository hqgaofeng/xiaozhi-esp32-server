# Phase 6 报告 — 联调 + 验收 + 上线

> 完成日期:2026-06-17
> 状态:**联调通过,代码已推送,tag v2.0.0**

---

## 1. 联调结果

### 后端环境
- 使用上游 Docker 镜像 `ghcr.nju.edu.cn/xinnan-tech/xiaozhi-esp32-server:web_latest`
- MySQL 8 + Redis 8 + Spring Boot Web(端口 8002)
- 通过 `docker-compose.dev.yml` 启动(3 个容器,无 model.pt 依赖)

### 联调通过的功能
- ✅ 用户登录(POST `/xiaozhi/user/login`)
- ✅ 公共配置获取(GET `/xiaozhi/user/getPubConfig`)
- ✅ 真实 admin 账号(在 http://localhost:8002 注册,密码 GAOfeng1@3)
- ✅ Vite 代理 `/xiaozhi/*` → `http://127.0.0.1:8002`(已配)

### 已验证
- 浏览器 http://localhost:5173 登录页正常显示
- 提交账号密码后,真实调用后端 API
- 登录成功后,token 存 localStorage,后续请求自动带 Bearer token
- F12 Console 无 500 / 401 错误(除 `getPubConfig` 公开接口不需要 token,预期行为)

### 未联调(保持 Mock)
- 设备列表 API(首页 Dashboard 仍用 mockDevices)
- 智能体列表 API(智能体管理仍用 mockAgents)
- 对话记录 API(对话页仍用 mockSessions)
- MQTT 真实下发(开发者页用 mock)
- 声纹训练 / 识别(完全 Mock,Phase 7+)

**理由**: 上游 `web_latest` 镜像的 API 端点路径与本仓库旧 `apis/module/*.js` 路径**有差异**(接口命名、请求/响应结构、鉴权方式),完整对接需要**逐个端点核对 + 改 axios 适配层**,**需要 1-2 天**。这部分留作 Phase 7 工作。

---

## 2. 验收 Checklist

### 6 阶段功能
- [x] Phase 0 勘察 + 分支 + 路由
- [x] Phase 1 基础设施(Vue 3 + Vite + Element Plus + Pinia + 设计 token)
- [x] Phase 2 通用框架(布局壳 + 4 导航 + 登录页)
- [x] Phase 3 首页 Dashboard(4 统计 + 双矩阵 + 实时流)
- [x] Phase 4 设备/智能体/对话/麦克风(核心 CRUD)
- [x] Phase 5 系统配置/开发者/声纹/TTS/OTA(5 个高频页)
- [x] Phase 6 后端联调 + 文档 + Tag

### 响应式
- [x] 桌面端(≥ 1024):深色侧边栏 + 顶栏 + 主区
- [x] 平板端(640-1279):顶部 Tab + 顶栏 + 主区
- [x] 手机端(< 640):MobileHeader + 主区 + 底部 Tab Bar + 抽屉式导航

### 联调
- [x] 后端 Docker 启动
- [x] 用户登录 API
- [x] Token 持久化(localStorage)
- [x] 401 自动跳转登录页
- [ ] 设备/智能体/对话 API 真实数据(Phase 7)
- [ ] WebSocket 实时流(Phase 7)
- [ ] 媒体流语音(Phase 7)

### 文档
- [x] CHANGELOG.md(完整 v2.0.0 变更说明)
- [x] README.md(v2 介绍 + 启动指南)
- [x] docs/design-system.md
- [x] docs/responsive-spec.md
- [x] docs/refactor-roadmap.md
- [x] docs/phase-0/2/3-report.md
- [ ] Phase 4.1/4.2/4.3/4.4/5 报告(可在后续完善)

### Git
- [x] 分支:`refactor/v2`
- [x] 提交历史:清晰(每个 Phase 一个 commit)
- [x] Tag:v2.0.0

---

## 3. 项目最终状态

### 文件统计
- 新增:**30+ 个新文件**
  - `src/theme/`:7 个 SCSS partial
  - `src/composables/`:4 个(useBreakpoint/useEventBus/useToast/useVoiceRecorder)
  - `src/components/`:12+ 个业务组件
  - `src/layouts/`:DefaultLayout + 4 个导航
  - `src/views/`:6+ 个页面(Home/Login/Device/Agent/Chat/Feature 等)
  - `src/stores/`:3 个 Pinia store
  - `src/router/`:完整路由
  - `docs/`:4 个文档

- 修改:
  - `package.json`(Vue 3 + Vite + TS + Element Plus)
  - `vite.config.ts`(全新)
  - `tsconfig.json`(全新)
  - `index.html`(Vite 入口)
  - `.env*`(Vite 变量)
  - `src/main.ts`(Element Plus CSS 修复)
  - `src/App.vue`(新布局 + 麦克风集成)
  - `src/styles/tokens.css`(CSS 变量)
  - `src/styles/element-plus-overrides.css`(组件覆盖)

### 性能(本地估算)
- 首屏 LCP: < 1.5s(Vite + 路由懒加载)
- Bundle 主 chunk: < 500KB gzipped
- Lighthouse Perf: ≥ 90(预估)
- A11y: 需 Phase 7+ 走查

### 启动命令汇总

**开发**:
```bash
npm install
npm run dev
# 打开 http://localhost:5173
```

**生产构建**:
```bash
npm run build
# 输出到 dist/
```

**后端(Docker)**:
```bash
cd ../xiaozhi-server
docker compose -f docker-compose.dev.yml up -d
# 后端在 http://localhost:8002
```

---

## 4. 遗留工作(Phase 7+)

1. **API 端点核对 + 适配**:
   - 设备/智能体/对话的真实 API 路径与本仓库旧路径差异
   - 需要逐个写 axios 适配层
   - 预计 1-2 天

2. **WebSocket 实时流**:
   - LiveStream 当前用 setInterval Mock
   - 需要接真实 WebSocket(8000 端口)

3. **媒体流语音(麦克风真实识别)**:
   - 当前用 mock 状态机
   - 需要 MediaRecorder + WebSocket 推流到 ASR

4. **单元测试 + E2E**:
   - Vitest 组件测试(StatCard / LiveStream / Drawer 等)
   - Playwright E2E(登录 / 设备管理 / 智能体)

5. **i18n 接入**:
   - 6 种语言资源(已有,需接入)
   - 切换组件 + Locale 切换

6. **暗色模式**:
   - token 体系已预留
   - 需要切换 :root.dark 变量

7. **遗留 10+ 长尾页**:
   - 模型配置 / 参数管理 / 知识库 / 字典 / 替词 / 地址簿 / 文档上传 / 替换词 / 角色配置 / 模板快速配置
   - 当前都是 LegacyView 占位

---

## 5. 致谢

- 原项目: [xinnan-tech/xiaozhi-esp32-server](https://github.com/xinnan-tech/xiaozhi-esp32-server)
- 设计规范: [ui-ux-pro-max](https://uupm.cc) 161 行业规则 + 67 UI 风格
- 重构:fork owner(单人 6 阶段实施)
