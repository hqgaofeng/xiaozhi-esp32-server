# Phase 2 报告 — 通用框架

> 完成日期:2026-06-12
> 状态:**文件已就位,等待用户本地跑通验收**

---

## 1. Phase 2 创建的文件

### 布局壳
- ✅ `src/layouts/DefaultLayout.vue` — 三态自动切换
- ✅ `src/layouts/SidebarNav.vue` — 桌面深色侧边栏
- ✅ `src/layouts/TopBar.vue` — 桌面/Pad 顶栏(搜索 / 通知 / 用户菜单)
- ✅ `src/layouts/PadTopTabs.vue` — Pad 顶部 Tab
- ✅ `src/layouts/MobileHeader.vue` — 手机极简顶栏
- ✅ `src/layouts/MobileTabBar.vue` — 手机底部 5 项 Tab Bar(含中央麦克风)

### 通用组件
- ✅ `src/components/common/EmptyState.vue` — 空状态
- ✅ `src/components/common/LoadingState.vue` — 加载旋转图标
- ✅ `src/components/common/ErrorState.vue` — 错误 + 重试

### View
- ✅ `src/views/LegacyView.vue` — 旧 23 view 通用占位
- ✅ `src/views/Login.vue` — 重新设计的登录页(三端自适应)

### 路由
- ✅ `src/router/index.ts` — 23 条业务路由全部接入,全部指向 LegacyView
  - 登录/注册/找回/404 不走 DefaultLayout
  - 业务页都走 DefaultLayout
  - 路由守卫保留 token 校验
  - 全局后置更新 document.title

### App.vue
- ✅ 新 `App.vue` — 根据路由决定走全屏还是壳布局

---

## 2. 三态切换逻辑(在 DefaultLayout)

```
isDesktop (≥ 1024) ──> 侧边栏(240px) + 顶栏(56px) + 主区
isPad (640-1023)    ──> 顶部 Tab(48px) + 顶栏(56px) + 主区
isMobile (< 640)    ──> 极简顶栏(48px) + 主区 + 底部 Tab Bar(56px)
```

`isMobile / isPad / isDesktop` 来自 `useBreakpoint()`。

---

## 3. 关键决策

### 登录页放在 Login.vue(大写),旧 login.vue 保留
- 新 router 引用 `Login.vue`,Windows 文件系统大小写不敏感,Vite 能找到
- 旧 `login.vue` 等 Phase 5 统一清理

### 占位策略:用 LegacyView 包装,旧 23 view 不动
- 旧 `.vue` 保留,新 router 指向 LegacyView
- LegacyView 显示"该页将在 Phase X 重做"
- **好处**:Phase 2 一次到位,Phase 3-5 逐页替换组件
- **回退**:删 router 一行就能回到旧 view

### i18n 暂不接
- 6 种语言工作量太大
- Phase 2 先用中文 hardcode
- Phase 5 收尾时统一接入

---

## 4. 验收 Checklist(用户跑)

```powershell
cd D:\ESP32\xiaozhi-esp32-server-new\main\manager-web
npm run dev
```

访问 http://localhost:5173,应该看到 **新登录页**(左侧深色品牌区 + 右侧白底登录表单)。

**桌面** (窗口 > 1024px):
- [ ] 左侧深色品牌区,小智 logo + 4 个特性列表
- [ ] 右侧白底登录卡片(用户名 / 密码 / 记住我 / 忘记密码 / 登录按钮 / 立即注册)
- [ ] 切到 < 1024:左侧变单列品牌区
- [ ] 切到 < 640:左侧只显示 logo + 标题,特性隐藏

**登录后**(在 console 手动设 token 模拟已登录):
```js
localStorage.setItem('token', 'mock-token-12345')
localStorage.setItem('userInfo', JSON.stringify({username: 'test'}))
location.reload()
```

访问 http://localhost:5173/home:
- [ ] 桌面:深色侧边栏 + 浅色主区
- [ ] 顶栏:搜索框 + 通知 + 用户菜单
- [ ] 主区:LegacyView 占位(显示"概览将在 Phase 3 重做")
- [ ] 点侧边栏其他项:进占位页
- [ ] 点用户菜单:弹出"切换账号 / 退出登录"

**切档测试**:
- 浏览器 DevTools 切到 Pad 尺寸(800x1024):顶部 Tab 出现,侧边栏隐藏
- 切到手机尺寸(375x667):底部 Tab Bar 出现,中央悬浮麦克风按钮

---

## 5. 已知风险

1. **i18n 缺失**:LegacyView/Login 里的中文是 hardcode,Phase 5 统一补
2. **登出流程**:TopBar 的退出按钮调 `auth.logout()`,但后端 API 还没接(Phase 6 联调)
3. **搜索框**:点了之后只是 toast,Phase 4 实装
4. **通知中心**:只有红点,Phase 3 之后接 WebSocket
5. **CSS 编译可能还有错**:因为 Phase 1 留了 sass 警告,Phase 2 没动 vite.config,可能需要再看

---

## 6. 接下来 Phase 3 预告

如果 Phase 2 验收通过,下一步进 **Phase 3:首页 Dashboard(2-3 天)**:
- 4 个统计卡(StatCard)
- 智能体卡 / 设备卡
- Bento Grid 三端布局
- 实时调用流(WebSocket,mock 数据)
- 数字人 Tab 切换
