<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- 模态框标题 -->
      <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
          <i class="fas fa-chart-bar mr-2 text-blue-500"></i>
          模板使用分析
        </h2>
        <button 
          @click="close"
          class="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <i class="fas fa-times text-gray-500"></i>
        </button>
      </div>
      
      <!-- 模态框内容 -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <!-- 数据摘要卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div class="text-sm text-blue-500 mb-1">模板总数</div>
            <div class="text-2xl font-bold text-blue-700">{{ totalTemplates }}</div>
            <div class="text-xs text-blue-400 mt-1">按分类统计的邮件模板总数</div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg border border-green-100">
            <div class="text-sm text-green-500 mb-1">使用次数最多</div>
            <div class="text-2xl font-bold text-green-700">{{ mostUsedTemplate?.name || '无数据' }}</div>
            <div class="text-xs text-green-400 mt-1">
              {{ mostUsedTemplate ? `已使用 ${mostUsedTemplate.usageCount} 次` : '无使用记录' }}
            </div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div class="text-sm text-purple-500 mb-1">分类数量</div>
            <div class="text-2xl font-bold text-purple-700">{{ categoriesCount }}</div>
            <div class="text-xs text-purple-400 mt-1">共有 {{ categoriesCount }} 个不同分类</div>
          </div>
        </div>
        
        <!-- 使用频率图表 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">模板使用频率</h3>
          <div class="h-64 w-full bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div class="h-full flex items-end justify-between gap-2">
              <div 
                v-for="(template, index) in topTemplates" 
                :key="template.id"
                class="relative group flex-1 flex flex-col items-center"
                :style="{ height: '100%' }"
              >
                <!-- 柱状图条形 -->
                <div 
                  class="w-full rounded-t-md transition-all group-hover:opacity-80"
                  :class="{
                    'bg-blue-500': index === 0,
                    'bg-blue-400': index === 1,
                    'bg-blue-300': index === 2,
                    'bg-blue-200': index === 3,
                    'bg-blue-100': index >= 4
                  }"
                  :style="{ 
                    height: `${(template.usageCount / maxUsageCount) * 100}%`,
                    minHeight: '20px'
                  }"
                ></div>
                
                <!-- 模板名称 -->
                <div class="text-xs text-gray-500 mt-1 text-center truncate max-w-full px-1">
                  {{ template.name }}
                </div>
                
                <!-- 悬浮提示 -->
                <div class="absolute bottom-full mb-2 bg-white p-2 rounded shadow-lg border border-gray-200 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-48 -translate-x-1/2 left-1/2">
                  <div class="font-medium">{{ template.name }}</div>
                  <div>分类: {{ template.category }}</div>
                  <div>使用次数: {{ template.usageCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分类分布饼图 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">模板分类分布</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 饼图 -->
            <div class="rounded-lg border border-gray-200 p-4 flex justify-center items-center">
              <div class="relative h-48 w-48 flex justify-center items-center">
                <!-- 模拟饼图 -->
                <svg viewBox="0 0 100 100" class="h-full w-full">
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#e5e7eb" stroke-width="10" />
                  
                  <!-- 分类扇形，根据真实数据计算角度 -->
                  <template v-for="(category, index) in categoryStats.slice(0, 4)" :key="category.name">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="transparent" 
                      :stroke="getCategoryColor(index)" 
                      stroke-width="10"
                      :stroke-dasharray="`${getCategoryArc(category.count)} ${totalCircumference}`"
                      :stroke-dashoffset="-getOffsetForCategory(index)"
                      transform="rotate(-90 50 50)"
                    />
                  </template>
                </svg>
                <div class="absolute text-center">
                  <div class="text-sm text-gray-500">总计</div>
                  <div class="text-xl font-bold text-gray-700">{{ totalTemplates }}</div>
                </div>
              </div>
            </div>
            
            <!-- 图例 -->
            <div class="rounded-lg border border-gray-200 p-4">
              <h4 class="text-sm font-medium text-gray-600 mb-3">分类统计</h4>
              <div class="space-y-2">
                <div 
                  v-for="(category, index) in categoryStats" 
                  :key="category.name"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <div 
                      class="w-3 h-3 rounded-full mr-2"
                      :class="{
                        'bg-blue-500': index === 0,
                        'bg-green-500': index === 1,
                        'bg-yellow-500': index === 2,
                        'bg-purple-500': index === 3,
                        'bg-gray-500': index >= 4
                      }"
                    ></div>
                    <span class="text-sm text-gray-600">{{ category.name }}</span>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-700">{{ category.count }}</span>
                    <span class="text-xs text-gray-500 ml-1">({{ (category.count / totalTemplates * 100).toFixed(1) }}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 使用趋势图 -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <i class="fas fa-chart-line text-blue-500 mr-2"></i>
            使用趋势（最近7天）
          </h3>
          <div class="h-80 w-full bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
            <!-- 折线图 -->
            <div class="h-full flex flex-col">
              <div class="flex justify-between items-center mb-4">
                <div class="text-sm font-medium text-gray-600">每日使用量</div>
                <div class="flex items-center gap-5">
                  <div class="flex items-center gap-1.5">
                    <span class="block w-2 h-2 bg-blue-400 rounded-full opacity-70"></span>
                    <span class="text-xs text-gray-500">使用次数</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="block w-2 h-2 bg-emerald-400 rounded-full opacity-70"></span>
                    <span class="text-xs text-gray-500">新建模板</span>
                  </div>
                </div>
              </div>
              <div class="flex-1 relative">
                <!-- 网格线 -->
                <div class="absolute inset-0 grid grid-rows-4 gap-0 pointer-events-none">
                  <div class="border-t border-gray-50"></div>
                  <div class="border-t border-gray-50"></div>
                  <div class="border-t border-gray-50"></div>
                  <div class="border-t border-gray-50"></div>
                </div>

                <!-- Y轴标签 -->
                <div class="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-300 pointer-events-none">
                  <div class="-translate-y-1/2">100</div>
                  <div class="-translate-y-1/2">75</div>
                  <div class="-translate-y-1/2">50</div>
                  <div class="-translate-y-1/2">25</div>
                  <div class="-translate-y-1/2">0</div>
                </div>
                
                <!-- X轴线 -->
                <div class="absolute bottom-0 left-0 right-0 border-t border-gray-100"></div>
                
                <!-- 主要区域 - 图表 -->
                <div class="absolute inset-0 pl-6">
                  <!-- 绘制折线 -->
                  <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <!-- 使用次数折线 -->
                    <polyline
                      points="0,50 15,45 30,60 45,35 60,40 75,25 90,30 100,20"
                      fill="none"
                      stroke="#60a5fa"
                      stroke-width="1"
                      class="trend-line"
                      stroke-opacity="0.7"
                    />
                    
                    <!-- 折线下方阴影区域 -->
                    <path
                      d="M0,50 L15,45 L30,60 L45,35 L60,40 L75,25 L90,30 L100,20 L100,100 L0,100 Z"
                      fill="url(#blueGradient)"
                      opacity="0.05"
                    />
                    
                    <!-- 新建模板折线 -->
                    <polyline
                      points="0,70 15,65 30,75 45,60 60,65 75,50 90,55 100,45"
                      fill="none"
                      stroke="#34d399"
                      stroke-width="1"
                      stroke-dasharray="2 2"
                      class="trend-line"
                      stroke-opacity="0.7"
                    />
                    
                    <!-- 定义渐变 -->
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#60a5fa" />
                        <stop offset="100%" stop-color="#60a5fa" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    
                    <!-- 使用次数数据点 -->
                    <g>
                      <circle cx="0" cy="50" r="1.5" fill="white" stroke="#60a5fa" stroke-width="1" class="data-point" />
                      <circle cx="15" cy="45" r="1.5" fill="white" stroke="#60a5fa" stroke-width="1" class="data-point" />
                      <circle cx="30" cy="60" r="1.5" fill="white" stroke="#60a5fa" stroke-width="1" class="data-point" />
                      <circle cx="45" cy="35" r="1.5" fill="white" stroke="#60a5fa" stroke-width="1" class="data-point" />
                      <circle cx="60" cy="40" r="1.5" fill="white" stroke="#60a5fa" stroke-width="1" class="data-point" />
                      <circle cx="75" cy="25" r="1.5" fill="white" stroke="#60a5fa" stroke-width="1" class="data-point" />
                      <circle cx="90" cy="30" r="1.5" fill="white" stroke="#60a5fa" stroke-width="1" class="data-point" />
                      <circle cx="100" cy="20" r="1.5" fill="white" stroke="#60a5fa" stroke-width="1" class="data-point" />
                    </g>
                    
                    <!-- 新建模板数据点 -->
                    <g>
                      <circle cx="0" cy="70" r="1" fill="white" stroke="#34d399" stroke-width="1" class="data-point" />
                      <circle cx="15" cy="65" r="1" fill="white" stroke="#34d399" stroke-width="1" class="data-point" />
                      <circle cx="30" cy="75" r="1" fill="white" stroke="#34d399" stroke-width="1" class="data-point" />
                      <circle cx="45" cy="60" r="1" fill="white" stroke="#34d399" stroke-width="1" class="data-point" />
                      <circle cx="60" cy="65" r="1" fill="white" stroke="#34d399" stroke-width="1" class="data-point" />
                      <circle cx="75" cy="50" r="1" fill="white" stroke="#34d399" stroke-width="1" class="data-point" />
                      <circle cx="90" cy="55" r="1" fill="white" stroke="#34d399" stroke-width="1" class="data-point" />
                      <circle cx="100" cy="45" r="1" fill="white" stroke="#34d399" stroke-width="1" class="data-point" />
                    </g>
                  </svg>
                </div>
              </div>
              
              <!-- X轴标签 -->
              <div class="h-8 mt-4 flex justify-between text-xs text-gray-400">
                <div v-for="day in 7" :key="day" class="flex flex-col items-center">
                  <div class="font-medium">{{ getDayLabel(7-day) }}</div>
                  <div class="text-xs text-gray-300 mt-1">{{ getTrendValue(7-day, 'usage') }}次</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { emailTemplates } from '~/data/emailTemplates'
import type { EmailTemplate } from '~/types/email'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// 为每个模板添加模拟的使用次数数据
const templatesWithUsage = computed(() => {
  return emailTemplates.map(template => ({
    ...template,
    // 生成一个随机的使用次数，仅用于演示
    usageCount: Math.floor(Math.random() * 100)
  }))
})

// 计算模板总数
const totalTemplates = computed(() => emailTemplates.length)

// 计算最常用的模板
const mostUsedTemplate = computed(() => {
  return [...templatesWithUsage.value].sort((a, b) => b.usageCount - a.usageCount)[0]
})

// 计算最大使用次数，用于图表绘制
const maxUsageCount = computed(() => {
  return Math.max(...templatesWithUsage.value.map(t => t.usageCount))
})

// 获取排名前5的模板
const topTemplates = computed(() => {
  return [...templatesWithUsage.value]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5)
})

// 计算分类数量
const categoriesCount = computed(() => {
  const categories = new Set(emailTemplates.map(t => t.category))
  return categories.size
})

// 按分类统计模板数量
const categoryStats = computed(() => {
  const stats: { [key: string]: number } = {}
  
  emailTemplates.forEach(template => {
    if (!stats[template.category]) {
      stats[template.category] = 0
    }
    stats[template.category]++
  })
  
  return Object.entries(stats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// 获取日期标签（最近7天）
function getDayLabel(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 生成趋势数据（模拟数据）
function getTrendValue(daysAgo: number, type: 'usage' | 'creation'): number {
  // 生成稳定的随机数，根据日期和类型
  const seed = daysAgo * (type === 'usage' ? 10 : 5)
  
  if (type === 'usage') {
    // 使用次数: 50-90之间随机，但每次刷新保持一致
    return 50 + Math.floor((Date.now() % 97 + seed) % 41)
  } else {
    // 创建次数: 10-30之间随机，但每次刷新保持一致
    return 10 + Math.floor((Date.now() % 83 + seed) % 21)
  }
}

// 计算饼图相关数据
const totalCircumference = computed(() => 2 * Math.PI * 45)

// 获取分类在饼图中的扇区弧长
function getCategoryArc(count: number): number {
  return (count / totalTemplates.value) * totalCircumference.value
}

// 获取分类的偏移量
function getOffsetForCategory(index: number): number {
  if (index === 0) return 0
  
  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += getCategoryArc(categoryStats.value[i].count)
  }
  return offset
}

// 获取分类的颜色
function getCategoryColor(index: number): string {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280']
  return index < colors.length ? colors[index] : colors[colors.length - 1]
}

function close() {
  emit('close')
}
</script>

<style scoped>
/* 趋势图样式 */
.data-point {
  transition: r 0.3s ease, stroke-width 0.3s ease, stroke-opacity 0.3s ease;
  cursor: pointer;
}

.data-point:hover {
  r: 2.5;
  stroke-width: 1.25;
  stroke-opacity: 1;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
}

.trend-line {
  transition: stroke-width 0.3s ease, stroke-opacity 0.3s ease;
}

/* 为整个图表添加悬停效果 */
svg:hover .trend-line {
  stroke-width: 1.25;
  stroke-opacity: 0.9;
}
</style> 