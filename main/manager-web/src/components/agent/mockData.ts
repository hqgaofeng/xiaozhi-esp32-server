// components/agent/mockData.ts
// 智能体 Mock 数据

export interface Agent {
  id: string
  name: string
  avatar: string
  role: string
  description: string
  systemPrompt: string
  status: 'enabled' | 'disabled'
  category: 'general' | 'kitchen' | 'medical' | 'service' | 'children' | 'fitness' | 'meeting' | 'tea'
  knowledgeBaseIds: string[]
  tools: string[]  // 工具名
  ttsVoice: string
  ttsSpeed: number
  ttsPitch: number
  memoryType: 'short' | 'mem0ai' | 'powermem' | 'none'
  voiceprintEnabled: boolean
  callsToday: number
  callsTotal: number
  createdAt: string
  updatedAt: string
}

export const mockAgents: Agent[] = [
  {
    id: 'a1', name: '标准小智', avatar: '🤖', role: '通用对话',
    description: '日常陪伴 · 通用问答 · 闲聊',
    systemPrompt: '你是一个友好、聪明的小智助手,能够回答用户日常问题,提供陪伴。回答简洁、温暖、有同理心。',
    status: 'enabled', category: 'general',
    knowledgeBaseIds: ['kb_general'],
    tools: ['weather', 'calculator', 'web_search'],
    ttsVoice: 'zh_female_温柔', ttsSpeed: 1.0, ttsPitch: 1.0,
    memoryType: 'short', voiceprintEnabled: false,
    callsToday: 1248, callsTotal: 245678,
    createdAt: '2026-01-15', updatedAt: '2026-06-10'
  },
  {
    id: 'a2', name: '厨房助手', avatar: '🍳', role: '烹饪',
    description: '烹饪指导 · 计时提醒 · 食材查询',
    systemPrompt: '你是厨房助手小厨,熟悉各种菜谱和烹饪技巧,会用计时器提醒用户,并能根据现有食材推荐菜谱。',
    status: 'enabled', category: 'kitchen',
    knowledgeBaseIds: ['kb_recipes'],
    tools: ['timer', 'recipe_search', 'unit_converter'],
    ttsVoice: 'zh_female_活泼', ttsSpeed: 1.1, ttsPitch: 1.0,
    memoryType: 'short', voiceprintEnabled: false,
    callsToday: 342, callsTotal: 12543,
    createdAt: '2026-02-20', updatedAt: '2026-05-28'
  },
  {
    id: 'a3', name: '医疗咨询', avatar: '⚕️', role: '健康',
    description: '症状问诊 · 药品查询 · 健康提醒',
    systemPrompt: '你是医疗咨询助手,但不能替代医生。回答要专业、谨慎,涉及严重症状时建议就医。',
    status: 'enabled', category: 'medical',
    knowledgeBaseIds: ['kb_medical', 'kb_drugs'],
    tools: ['drug_search', 'symptom_checker'],
    ttsVoice: 'zh_male_稳重', ttsSpeed: 0.95, ttsPitch: 0.9,
    memoryType: 'powermem', voiceprintEnabled: true,
    callsToday: 89, callsTotal: 4521,
    createdAt: '2026-03-05', updatedAt: '2026-06-05'
  },
  {
    id: 'a4', name: '客服小智', avatar: '🎧', role: '售后',
    description: '售后支持 · 工单处理 · 退换货',
    systemPrompt: '你是客服小智,负责产品售后支持。能查询订单状态、解答常见问题、创建工单。语气专业耐心。',
    status: 'disabled', category: 'service',
    knowledgeBaseIds: ['kb_faq', 'kb_products'],
    tools: ['order_query', 'ticket_create'],
    ttsVoice: 'zh_female_专业', ttsSpeed: 1.0, ttsPitch: 1.0,
    memoryType: 'mem0ai', voiceprintEnabled: false,
    callsToday: 567, callsTotal: 23456,
    createdAt: '2026-02-01', updatedAt: '2026-06-08'
  },
  {
    id: 'a5', name: '故事姐姐', avatar: '📚', role: '儿童',
    description: '儿童故事 · 睡前陪伴 · 启蒙教育',
    systemPrompt: '你是故事姐姐,会用温柔生动的语气讲儿童故事、唱儿歌,适合 3-10 岁小朋友。',
    status: 'enabled', category: 'children',
    knowledgeBaseIds: ['kb_stories'],
    tools: ['story_search', 'music_play'],
    ttsVoice: 'zh_female_活泼', ttsSpeed: 0.9, ttsPitch: 1.1,
    memoryType: 'short', voiceprintEnabled: false,
    callsToday: 423, callsTotal: 18734,
    createdAt: '2026-01-22', updatedAt: '2026-05-30'
  },
  {
    id: 'a6', name: '健身教练', avatar: '💪', role: '运动',
    description: '动作指导 · 训练计划 · 饮食建议',
    systemPrompt: '你是专业健身教练,熟悉各种训练动作、计划编排,能根据用户目标推荐方案。',
    status: 'enabled', category: 'fitness',
    knowledgeBaseIds: ['kb_workouts'],
    tools: ['workout_plan', 'calorie_calc'],
    ttsVoice: 'zh_male_阳光', ttsSpeed: 1.05, ttsPitch: 1.0,
    memoryType: 'short', voiceprintEnabled: false,
    callsToday: 178, callsTotal: 8923,
    createdAt: '2026-03-15', updatedAt: '2026-06-01'
  },
  {
    id: 'a7', name: '茶道助手', avatar: '🍵', role: '茶艺',
    description: '茶叶知识 · 茶艺指导 · 冲泡建议',
    systemPrompt: '你是茶道助手,熟悉六大茶类知识和冲泡方法,会用古典优雅的语调介绍茶文化。',
    status: 'enabled', category: 'tea',
    knowledgeBaseIds: ['kb_tea'],
    tools: ['tea_search'],
    ttsVoice: 'zh_male_古典', ttsSpeed: 0.95, ttsPitch: 0.95,
    memoryType: 'short', voiceprintEnabled: false,
    callsToday: 23, callsTotal: 1234,
    createdAt: '2026-04-01', updatedAt: '2026-05-25'
  },
  {
    id: 'a8', name: '会议助手', avatar: '💼', role: '办公',
    description: '会议记录 · 议程管理 · 决策追踪',
    systemPrompt: '你是专业会议助手,能记录会议要点、生成议程、追踪决策项。表达专业简洁。',
    status: 'enabled', category: 'meeting',
    knowledgeBaseIds: [],
    tools: ['meeting_transcribe', 'agenda_generator'],
    ttsVoice: 'zh_male_专业', ttsSpeed: 1.0, ttsPitch: 1.0,
    memoryType: 'mem0ai', voiceprintEnabled: true,
    callsToday: 11, callsTotal: 678,
    createdAt: '2026-05-15', updatedAt: '2026-06-12'
  }
]

export const mockVoices = [
  { value: 'zh_female_温柔', label: '中文女声 · 温柔' },
  { value: 'zh_female_活泼', label: '中文女声 · 活泼' },
  { value: 'zh_female_专业', label: '中文女声 · 专业' },
  { value: 'zh_male_稳重', label: '中文男声 · 稳重' },
  { value: 'zh_male_阳光', label: '中文男声 · 阳光' },
  { value: 'zh_male_古典', label: '中文男声 · 古典' },
  { value: 'zh_male_专业', label: '中文男声 · 专业' }
]

export const mockMemoryTypes = [
  { value: 'short', label: '本地短期记忆' },
  { value: 'mem0ai', label: 'mem0ai 云端记忆' },
  { value: 'powermem', label: 'PowerMem 智能记忆' },
  { value: 'none', label: '无记忆' }
]

export const mockCategories = [
  { value: 'general', label: '通用' },
  { value: 'kitchen', label: '厨房' },
  { value: 'medical', label: '医疗' },
  { value: 'service', label: '客服' },
  { value: 'children', label: '儿童' },
  { value: 'fitness', label: '健身' },
  { value: 'meeting', label: '办公' },
  { value: 'tea', label: '茶艺' }
]

export const mockTemplates = [
  { id: 't1', name: '通用客服', category: 'service', description: '标准客服场景,支持订单查询、工单创建', icon: '🎧' },
  { id: 't2', name: '儿童陪伴', category: 'children', description: '3-10 岁儿童故事、儿歌', icon: '📚' },
  { id: 't3', name: '健康助理', category: 'medical', description: '症状问诊、药品查询', icon: '⚕️' },
  { id: 't4', name: '厨房助手', category: 'kitchen', description: '菜谱查询、烹饪指导', icon: '🍳' },
  { id: 't5', name: '健身教练', category: 'fitness', description: '训练计划、动作指导', icon: '💪' },
  { id: 't6', name: '会议记录', category: 'meeting', description: '会议记录、议程管理', icon: '💼' }
]
