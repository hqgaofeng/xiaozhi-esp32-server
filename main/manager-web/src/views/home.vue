<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBreakpoint } from '@/composables/useBreakpoint'
import {
  Cpu,
  Activity,
  MessageCircle,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-vue-next'

import StatCard from '@/components/dashboard/StatCard.vue'
import AgentCard from '@/components/dashboard/AgentCard.vue'
import DeviceCard from '@/components/dashboard/DeviceCard.vue'
import LiveStream from '@/components/dashboard/LiveStream.vue'

const router = useRouter()
const { isMobile, isPad, breakpoint } = useBreakpoint()

// === Mock 数据(Phase 6 接真实 API) ===
const stats = [
  { value: 23, label: '设备总数', trend: 'up' as const, trendValue: '+2 本周', accent: 'primary' as const, icon: Cpu },
  { value: 19, label: '在线设备', trend: 'flat' as const, description: '4 离线', accent: 'success' as const, icon: Activity },
  { value: 156, label: '今日对话', trend: 'up' as const, trendValue: '+18% 较昨日', accent: 'primary' as const, icon: MessageCircle },
  { value: 432, label: '唤醒次数', trend: 'up' as const, trendValue: '+5.2%', accent: 'accent' as const, icon: Zap }
]

const agents = [
  { id: 'a1', name: '标准小智', role: '日常陪伴 · 通用问答', calls: 1248, enabled: true },
  { id: 'a2', name: '厨房助手', role: '烹饪指导 · 计时提醒', calls: 342, enabled: true },
  { id: 'a3', name: '医疗咨询', role: '症状问诊 · 药品查询', calls: 89, enabled: true },
  { id: 'a4', name: '客服小智', role: '售后支持 · 工单处理', calls: 567, enabled: false },
  { id: 'a5', name: '故事姐姐', role: '儿童故事 · 睡前陪伴', calls: 423, enabled: true },
  { id: 'a6', name: '健身教练', role: '动作指导 · 训练计划', calls: 178, enabled: true }
]

const devices = [
  { id: 'd1', name: '客厅音箱-01', mac: '11:22:33:44:55:66', status: 'online' as const, agent: '标准小智', callsToday: 23, wakesToday: 47, lastActive: '2 分钟前', signal: 'strong' as const },
  { id: 'd2', name: '厨房音箱-01', mac: '11:22:33:44:55:67', status: 'online' as const, agent: '厨房助手', callsToday: 12, wakesToday: 28, lastActive: '1 小时前', signal: 'strong' as const },
  { id: 'd3', name: '卧室音箱-01', mac: '11:22:33:44:55:68', status: 'online' as const, agent: '故事姐姐', callsToday: 8, wakesToday: 14, lastActive: '30 分钟前', signal: 'medium' as const },
  { id: 'd4', name: '书房音箱-01', mac: '11:22:33:44:55:69', status: 'offline' as const, agent: '标准小智', callsToday: 0, wakesToday: 0, lastActive: '3 天前', signal: 'offline' as const },
  { id: 'd5', name: '主卧小智', mac: '11:22:33:44:55:70', status: 'error' as const, agent: '标准小智', callsToday: 5, wakesToday: 11, lastActive: '15 分钟前', signal: 'weak' as const },
  { id: 'd6', name: '次卧音箱', mac: '11:22:33:44:55:71', status: 'online' as const, agent: '健身教练', callsToday: 6, wakesToday: 12, lastActive: '5 分钟前', signal: 'strong' as const }
]

const visibleAgents = computed(() => agents.slice(0, 4))
const visibleDevices = computed(() => devices.slice(0, 4))

function goMoreAgents() {
  router.push('/agent-template-management')
}

function goMoreDevices() {
  router.push('/device-management')
}
</script>

<template>
  <div class="home-page" :class="`bp-${breakpoint}`">
    <div class="greeting">
      <div class="greeting-text">
        <h1 class="greeting-title">
          <Sparkles :size="20" class="sparkle" />
          早,小智在线
        </h1>
        <p class="greeting-sub">家里一切正常,共 19 台设备在线</p>
      </div>
    </div>

    <div class="stats-grid">
      <StatCard
        v-for="(s, i) in stats"
        :key="i"
        :value="s.value"
        :label="s.label"
        :trend="s.trend"
        :trend-value="s.trendValue"
        :description="s.description"
        :accent="s.accent"
        :icon="s.icon"
      />
    </div>

    <div class="matrix-section">
      <section class="matrix-block">
        <header class="matrix-header">
          <div class="matrix-title">
            <h2>智能体</h2>
            <span class="count">{{ agents.length }}</span>
          </div>
          <button class="more-btn" @click="goMoreAgents">
            <span>查看全部</span>
            <ChevronRight :size="14" />
          </button>
        </header>
        <div class="matrix-grid">
          <AgentCard v-for="a in visibleAgents" :key="a.id" :agent="a" />
        </div>
      </section>

      <section class="matrix-block">
        <header class="matrix-header">
          <div class="matrix-title">
            <h2>设备</h2>
            <span class="count">{{ devices.length }}</span>
          </div>
          <button class="more-btn" @click="goMoreDevices">
            <span>查看全部</span>
            <ChevronRight :size="14" />
          </button>
        </header>
        <div class="matrix-grid">
          <DeviceCard v-for="d in visibleDevices" :key="d.id" :device="d" />
        </div>
      </section>
    </div>

    <section class="stream-section">
      <LiveStream />
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/breakpoints' as *;

.home-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;

  @include mobile {
    padding: 16px;
    gap: 16px;
  }
}

.greeting-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 4px;
}

.sparkle {
  color: var(--color-accent);
}

.greeting-sub {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @include tablet {
    grid-template-columns: repeat(3, 1fr);
  }

  @include pad {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.matrix-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @include pad {
    grid-template-columns: 1fr;
  }
}

.matrix-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.matrix-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.matrix-title {
  display: flex;
  align-items: center;
  gap: 8px;

  h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }
}

.count {
  font-size: 12px;
  color: var(--color-text-tertiary);
  padding: 1px 8px;
  background: var(--color-bg-page);
  border-radius: 9999px;
  font-weight: 500;
}

.more-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 120ms var(--ease-standard);

  &:hover {
    color: var(--color-primary);
    background: var(--color-primary-light);
  }
}

.matrix-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, 1fr);

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.stream-section {
  min-height: 360px;
}
</style>
