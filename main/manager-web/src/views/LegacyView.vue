<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { Construction, ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => (route.meta?.title as string) || route.name?.toString() || '未知页面')

const phaseMap: Record<string, string> = {
  DeviceManagement: 'Phase 4',
  AgentTemplateManagement: 'Phase 4',
  UserManagement: 'Phase 5',
  ModelConfig: 'Phase 4',
  KnowledgeBaseManagement: 'Phase 5',
  KnowledgeFileUpload: 'Phase 5',
  ServerSideManager: 'Phase 5',
  OtaManagement: 'Phase 5',
  VoiceResourceManagement: 'Phase 5',
  VoiceCloneManagement: 'Phase 5',
  VoicePrint: 'Phase 5',
  DictManagement: 'Phase 5',
  ProviderManagement: 'Phase 5',
  AddressBookManagement: 'Phase 5',
  ReplacementWordManagement: 'Phase 5',
  ParamsManagement: 'Phase 5',
  FeatureManagement: 'Phase 5',
  TemplateQuickConfig: 'Phase 5',
  RoleConfig: 'Phase 4'
}

const targetPhase = computed(() => phaseMap[route.name?.toString() || ''] || 'Phase 3+')
</script>

<template>
  <div class="legacy">
    <div class="card">
      <div class="icon-wrap">
        <Construction :size="48" />
      </div>
      <h2 class="title">{{ pageTitle }}</h2>
      <p class="phase">将在 <strong>{{ targetPhase }}</strong> 完成新版设计</p>
      <p class="desc">该页面在重构期间保留旧版功能,新设计正在按路线图推进中。</p>
      <div class="actions">
        <button class="btn btn-primary" @click="router.push('/home')">
          <ArrowLeft :size="14" />
          <span>返回首页</span>
        </button>
      </div>
      <div class="meta">
        <code>{{ route.fullPath }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.legacy {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.card {
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  padding: 40px 32px;
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-warning-light);
  color: var(--color-warning);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px;
}

.phase {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 16px;

  strong {
    color: var(--color-accent);
    font-weight: 600;
  }
}

.desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
  line-height: 1.5;
  margin: 0 0 24px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  transition: all 120ms var(--ease-standard);

  &-primary {
    background: var(--color-primary);
    color: white;

    &:hover {
      background: var(--color-primary-hover);
    }
  }
}

.meta {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-divider);

  code {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-text-tertiary);
  }
}
</style>
