// router/index.ts
// Vue Router 4 + Composition API 风格
// Phase 2 接入所有 23 个旧 view 路径(全部指向 LegacyView 占位)

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // 根路径 → 登录
  {
    path: '/',
    name: 'Welcome',
    component: () => import('@/views/Login.vue')
  },

  // 登录 / 注册 / 找回(走单独布局,不走 DefaultLayout)
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/retrieve-password',
    name: 'RetrievePassword',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '找回密码' }
  },

  // === 23 个业务路由(Phase 2 全部占位,Phase 3-5 逐步重做)===
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '概览', requiresAuth: true }
  },
  {
    path: '/role-config',
    name: 'RoleConfig',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '角色配置', requiresAuth: true }
  },
  {
    path: '/voice-print',
    name: 'VoicePrint',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '声纹管理', requiresAuth: true }
  },
  {
    path: '/device-management',
    name: 'DeviceManagement',
    component: () => import('@/views/DeviceManagement.vue'),
    meta: { title: '设备管理', requiresAuth: true }
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '用户管理', requiresAuth: true }
  },
  {
    path: '/model-config',
    name: 'ModelConfig',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '模型配置', requiresAuth: true }
  },
  {
    path: '/params-management',
    name: 'ParamsManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '参数管理', requiresAuth: true }
  },
  {
    path: '/knowledge-base-management',
    name: 'KnowledgeBaseManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '知识库管理', requiresAuth: true }
  },
  {
    path: '/knowledge-file-upload',
    name: 'KnowledgeFileUpload',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '文档上传', requiresAuth: true }
  },
  {
    path: '/server-side-management',
    name: 'ServerSideManager',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '服务端管理', requiresAuth: true }
  },
  {
    path: '/ota-management',
    name: 'OtaManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: 'OTA 管理', requiresAuth: true }
  },
  {
    path: '/voice-resource-management',
    name: 'VoiceResourceManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '语音资源', requiresAuth: true }
  },
  {
    path: '/voice-clone-management',
    name: 'VoiceCloneManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '声音克隆', requiresAuth: true }
  },
  {
    path: '/dict-management',
    name: 'DictManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '字典管理', requiresAuth: true }
  },
  {
    path: '/provider-management',
    name: 'ProviderManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: 'Provider 配置', requiresAuth: true }
  },
  {
    path: '/agent-template-management',
    name: 'AgentTemplateManagement',
    component: () => import('@/views/AgentTemplateManagement.vue'),
    meta: { title: '智能体模板', requiresAuth: true }
  },
  {
    path: '/template-quick-config',
    name: 'TemplateQuickConfig',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '模板快速配置', requiresAuth: true }
  },
  {
    path: '/feature-management',
    name: 'FeatureManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '功能配置', requiresAuth: true }
  },
  {
    path: '/replacement-word-management',
    name: 'ReplacementWordManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '替换词管理', requiresAuth: true }
  },
  {
    path: '/address-book-management',
    name: 'AddressBookManagement',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '通讯录管理', requiresAuth: true }
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/LegacyView.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH || '/'),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
  }
})

// 全局后置:更新 document.title
router.afterEach((to) => {
  const baseTitle = '小智智控台'
  const pageTitle = to.meta?.title as string | undefined
  document.title = pageTitle ? `${pageTitle} · ${baseTitle}` : baseTitle
})

export default router
