<template>
  <div class="history-panel bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- 面板头部 -->
    <div class="flex items-center justify-between p-3 border-b border-gray-200">
      <h3 class="text-sm font-medium text-gray-900">
        <i class="fas fa-history mr-2 text-blue-500"></i>
        操作历史
      </h3>
      
      <div class="flex items-center gap-2">
        <!-- 撤销按钮 -->
        <button
          @click="handleUndo"
          :disabled="!canUndo"
          class="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :title="canUndo ? '撤销 (Ctrl+Z)' : '无法撤销'"
          :aria-label="canUndo ? '撤销上一步操作' : '无法撤销'"
        >
          <i class="fas fa-undo text-sm"></i>
        </button>
        
        <!-- 重做按钮 -->
        <button
          @click="handleRedo"
          :disabled="!canRedo"
          class="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :title="canRedo ? '重做 (Ctrl+Y)' : '无法重做'"
          :aria-label="canRedo ? '重做下一步操作' : '无法重做'"
        >
          <i class="fas fa-redo text-sm"></i>
        </button>
        
        <!-- 清空历史按钮 -->
        <button
          @click="handleClearHistory"
          :disabled="historyList.length === 0"
          class="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-500"
          title="清空历史记录"
          aria-label="清空所有历史记录"
        >
          <i class="fas fa-trash text-sm"></i>
        </button>
      </div>
    </div>
    
    <!-- 历史记录列表 -->
    <div class="max-h-64 overflow-y-auto">
      <div v-if="historyList.length === 0" class="p-4 text-center text-gray-500 text-sm">
        暂无操作历史
      </div>
      
      <div v-else class="p-2 space-y-1">
        <div
          v-for="(item, index) in displayHistoryList"
          :key="index"
          @click="handleGoToState(item.index)"
          class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{
            'bg-blue-50 border border-blue-200': item.isCurrent,
            'text-gray-400': !item.isCurrent && item.index > currentIndex
          }"
          :title="`点击跳转到此状态 (${item.index + 1}/${historyList.length})`"
          role="button"
          :aria-label="`历史记录 ${item.index + 1}: ${item.description || '未知操作'}`"
          :aria-pressed="item.isCurrent"
        >
          <!-- 状态指示器 -->
          <div class="flex-shrink-0">
            <div
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-blue-500': item.isCurrent,
                'bg-gray-300': !item.isCurrent && item.index <= currentIndex,
                'bg-gray-200': !item.isCurrent && item.index > currentIndex
              }"
            ></div>
          </div>
          
          <!-- 操作描述 -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">
              {{ item.description || '未知操作' }}
            </div>
            <div class="text-xs text-gray-500">
              {{ formatTime(item.timestamp) }}
            </div>
          </div>
          
          <!-- 当前状态标识 -->
          <div v-if="item.isCurrent" class="flex-shrink-0">
            <i class="fas fa-arrow-left text-blue-500 text-xs"></i>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 面板底部信息 -->
    <div class="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
      <div class="flex justify-between items-center">
        <span>
          {{ currentIndex + 1 }} / {{ historyList.length }}
          <span v-if="maxHistorySize > 0">
            (最多 {{ maxHistorySize }} 条)
          </span>
        </span>
        
        <div class="flex items-center gap-2">
          <span v-if="canUndo || canRedo" class="text-blue-600">
            <i class="fas fa-keyboard text-xs mr-1"></i>
            Ctrl+Z/Y
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface HistoryItem {
  index: number
  state: any
  isCurrent: boolean
  description?: string
  timestamp?: number
}

interface Props {
  historyList: HistoryItem[]
  currentIndex: number
  canUndo: boolean
  canRedo: boolean
  maxHistorySize: number
}

interface Emits {
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'go-to-state', index: number): void
  (e: 'clear-history'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 计算属性
const displayHistoryList = computed(() => {
  return props.historyList
    .slice()
    .reverse() // 最新的在上面
    .map((item, reverseIndex) => ({
      ...item,
      originalIndex: props.historyList.length - 1 - reverseIndex
    }))
})

// 方法
const handleUndo = () => {
  if (props.canUndo) {
    emit('undo')
  }
}

const handleRedo = () => {
  if (props.canRedo) {
    emit('redo')
  }
}

const handleGoToState = (index: number) => {
  emit('go-to-state', index)
}

const handleClearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？此操作无法撤销。')) {
    emit('clear-history')
  }
}

const formatTime = (timestamp?: number): string => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (seconds < 60) {
    return `${seconds}秒前`
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<style scoped>
.history-panel {
  min-width: 250px;
  max-width: 300px;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 动画效果 */
.transition-colors {
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

/* 焦点样式 */
[role="button"]:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 禁用状态样式 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button:disabled:hover {
  background-color: transparent;
}

/* 当前状态高亮 */
.bg-blue-50 {
  background-color: #eff6ff;
}

.border-blue-200 {
  border-color: #bfdbfe;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .history-panel {
    min-width: 200px;
    max-width: 250px;
  }
  
  .text-sm {
    font-size: 0.8rem;
  }
  
  .text-xs {
    font-size: 0.7rem;
  }
}
</style>
