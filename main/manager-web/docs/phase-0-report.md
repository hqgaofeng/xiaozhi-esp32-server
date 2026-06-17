# Phase 0 报告 — 项目勘察

> 完成日期:2026-06-12
> 状态:**已勘察完成,等待用户执行本地操作后开始 Phase 1**

---

## 1. 实际项目结构(对比预估)

| 维度 | 预估 | 实际 | 备注 |
|---|---|---|---|
| View 数量 | 23 | **23** | ✅ 一致 |
| Component 数量 | 22(Dialog) | **37**(含非 Dialog) | Dialog 22 + 其他 15 |
| 路由 | 23 | **23** | ✅ 一致 |
| API 模块 | 散落 | **14 个模块化**(`apis/module/*.js`) | 比预期好 |
| Store | Vuex 单一文件 | **单一文件**(`store/index.js`) | 需要拆 Pinia |
| API 目录名 | `api/` | **`apis/`**(复数) | 注意拼写 |
| i18n 语言 | 5(简/繁/英/越/德) | **6**(简/繁/英/越/德/葡) | 比预估多 1 种 |

## 2. 关键文件速查

| 关注点 | 文件 | 备注 |
|---|---|---|
| 入口 | `src/main.js` | Vue 2 + Element UI 全量引入 |
| 根组件 | `src/App.vue` | 已有 `VUE_APP_H5_URL` 移动端跳转逻辑 |
| 路由 | `src/router/index.js` | 23 条,8 个带 `requiresAuth` |
| Store | `src/store/index.js` | token / userInfo / pubConfig |
| API | `src/apis/api.js` + `src/apis/module/*.js` | 14 模块,基于 `vue-axios` |
| 工具 | `src/utils/` | 6 个文件(cacheViewer/constant/date/featureManager/format/index) |
| 样式 | `src/styles/global.scss` | 1 个全局文件 |
| i18n | `src/i18n/` | 6 种语言 |

## 3. 现状技术债务清单(Phase 0 发现)

### 3.1 重构前必修
- [x] **API 已在 14 模块化** — 重构时直接复用,不用重写
- [x] **API 用 `vue-axios`** — 重构换原生 `axios` + TS,更类型安全
- [x] **路由懒加载已开启** — `import()` 函数形式,符合 Vite 风格
- [x] **i18n 6 种语言** — 实际比预期多 1 种,工作量大 20%

### 3.2 重构时一并修
- [ ] **EventBus 用 `new Vue()`** — Phase 1 换 `mitt`
- [ ] **Vuex 单一文件** — Phase 1 拆 Pinia(`useAuthStore` / `useUserStore` / `useConfigStore`)
- [ ] **Element UI 2 全量引入** — Phase 1 换 Element Plus 按需
- [ ] **Dialog 22 个** — Phase 2-5 改造为 Drawer/Sheet/Inline
- [ ] **Element Icons + 自写 unicode** — Phase 1 换 Lucide Icons
- [ ] **CSS 全用 scoped + global** — Phase 1 重组为 token + 全局 + 组件

### 3.3 现状已具备的优势(可复用)
- ✅ 路由懒加载已配
- ✅ API 模块化
- ✅ i18n 完备
- ✅ 局部状态(loading、search、dialog visible)用 `data()`,无过度 store
- ✅ 有 `featureManager` 工具(功能开关)

## 4. 与设计规范的对照

### 4.1 跟规划一致
- 23 view 数量对得上
- 路由设计合理(7 大领域 + 登录注册)
- 已有 `header-bar` / `version-footer` 复用基础

### 4.2 需要在 Phase 2 调整
- 现有 `home.vue` **不是 Dashboard**,是"设备列表"(以设备为主)。这跟我们的"智能体 + 设备双矩阵"首页设计不同,Phase 3 要完全重写
- 现有 `header-bar` 是横向顶部条,我们的设计在桌面是"侧边栏 + 顶栏"组合,要拆开
- 现有"添加设备"是 `AddWisdomBodyDialog`,Phase 4 要改为 `AddDeviceDrawer`

### 4.3 跟规划不同需要决策的点

**问题 1:移动端跳转 H5**

现状:`VUE_APP_H5_URL` 配了之后,**移动端访问 manager-web 会直接跳转走**。
设计:Phase 2-5 我们做了手机端适配,理论上不需要跳转了。

**3 个选项**:
- A. 保留跳转逻辑(老 H5 继续用,manager-web 只服务桌面/Pad)
- B. 取消跳转,manager-web 三端自适应
- C. 渐进式:Phase 2-4 期间保留跳转,Phase 5 验收后取消

**建议:选 C**。理由:渐进式最稳,旧 H5 还能用,新 manager-web 验证后再切。

**问题 2:home.vue 的现有内容**

当前 `home.vue` 显示"设备列表",部分业务依赖它。Phase 3 重做后,设备列表的内容需要去哪?
- A. 移到"设备管理"页(`/device-management`)
- B. 在首页保留一个"最近活跃设备"小区域,跳转到完整列表
- C. 业务逻辑重新切分,首页只放 Dashboard,设备全去设备页

**建议:选 C**。理由:跟设计规范一致,首页只做 Dashboard。

## 5. 后端 API 契约初查(Phase 6 详查)

通过 `apis/module/*.js` 文件名看到的 API 域(待 Phase 6 联调时验证):

```
addressBook.js  → 通讯录
admin.js        → 管理员/角色
agent.js        → 智能体
correctWord.js  → 替词
device.js       → 设备
dict.js         → 字典
knowledgeBase.js → 知识库
model.js        → 模型配置
ota.js          → OTA 升级
timbre.js       → 音色
user.js         → 用户/认证
voiceClone.js   → 声音克隆
voiceResource.js → 语音资源
```

**14 个 API 模块完全覆盖 view 23 个**,接口粒度合理。

## 6. Phase 0 验收

- [x] 项目结构已勘察
- [x] 路由表已记录
- [x] API 模块清单已记录
- [x] Store 结构已记录
- [x] i18n 语言已记录
- [x] 与设计规范的差异点已记录
- [x] Phase 0 报告已输出
- [ ] **新分支 `refactor/v2` 已切** — 需要用户在本地执行
- [ ] **现有项目 `npm run serve` 能跑起来** — 需要用户在本地验证
- [ ] **Vue DevTools 浏览器扩展已装** — 需要用户在本地操作

---

## 7. 待用户执行的操作(Phase 0 收尾)

请在本地终端执行以下 3 步:

### 步骤 1:切分支
```bash
cd D:\ESP32\xiaozhi-esp32-server-new\main\manager-web
git checkout -b refactor/v2
git push -u origin refactor/v2
```

### 步骤 2:验证能跑
```bash
npm install
npm run serve
```
访问 `http://localhost:8080`,应该看到现有登录页。
**如果跑不起来,先解决,不要带着问题进 Phase 1**。

### 步骤 3:装调试工具
- Chrome 装 [Vue DevTools](https://devtools.vuejs.org/)
- 准备一个手机(Pad 也行,能调 DevTools 更好)

执行完告诉我"Phase 0 完成",我开始 **Phase 1(基础设施)**。

---

## 8. Phase 1 开工清单预告(待 Phase 0 完成后启动)

Phase 1 我会一次性做完所有基础设施,你只需要在最后做一次联调。期间不需要你操作。

主要动作(技术细节,不用现在懂,Phase 1 时我会展示):
1. 创建新 `package.json`,升级到 Vue 3.4 + Vite 5 + Element Plus 2.x
2. 写 `vite.config.ts` 完整配置
3. 写 `tsconfig.json` + `env.d.ts`
4. 创建 `theme/` 目录(7 个 SCSS partial + index)
5. 创建 `composables/` 目录(`useResponsive.ts` / `useTheme.ts` / `useToast.ts` / `useDrawer.ts`)
6. 创建 `utils/` 新版本(`storage.ts` / `format.ts` / `eventBus.ts` 用 mitt)
7. 创建 `api/` 新版本(axios + TS 类型,接 14 个模块的迁移)
8. 创建 `styles/`(`reset.scss` / `element-overrides.scss` / `global.scss`)
9. 新 `App.vue`(Composition API 风格)
10. 新 `main.ts`(`createApp` 启动)

期间所有现有 .vue 文件**不会动**,只确保空模板能渲染就算 Phase 1 成功。

---

**Phase 0 报告完毕。请执行上面 3 步,执行完跟我说。**
