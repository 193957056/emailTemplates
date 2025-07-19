<template>
  <div class="auto-save-indicator flex items-center gap-2 text-sm">
    <!-- 保存状态图标 -->
    <div class="flex items-center">
      <i 
        :class="[saveStatusIcon, saveStatusColor]" 
        :title="getStatusTooltip()"
        aria-hidden="true"
      ></i>
    </div>
    
    <!-- 保存状态文本 -->
    <div class="flex flex-col">
      <span 
        :class="saveStatusColor"
        class="font-medium"
      >
        {{ saveMessage || getDefaultStatusText() }}
      </span>
      
      <!-- 最后保存时间 -->
      <span 
        v-if="lastSaveTime && saveStatus !== 'saving'"
        class="text-xs text-gray-500"
      >
        {{ lastSaveTimeText }}
      </span>
    </div>
    
    <!-- 自动保存设置 -->
    <div class="flex items-center gap-1 ml-2">
      <!-- 自动保存开关 -->
      <button
        @click="toggleAutoSave"
        :class="[
          'p-1 rounded text-xs transition-colors',
          isAutoSaveEnabled 
            ? 'text-green-600 hover:bg-green-50' 
            : 'text-gray-400 hover:bg-gray-50'
        ]"
        :title="isAutoSaveEnabled ? '关闭自动保存' : '开启自动保存'"
        :aria-label="isAutoSaveEnabled ? '关闭自动保存' : '开启自动保存'"
      >
        <i :class="isAutoSaveEnabled ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
      </button>
      
      <!-- 手动保存按钮 -->
      <button
        @click="handleManualSave"
        :disabled="saveStatus === 'saving' || !isDirty"
        class="p-1 rounded text-xs hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed text-blue-600"
        title="手动保存 (Ctrl+S)"
        aria-label="手动保存当前内容"
      >
        <i class="fas fa-save"></i>
      </button>
    </div>
    
    <!-- 保存提醒 -->
    <div 
      v-if="showSaveReminder"
      class="flex items-center gap-1 ml-2 px-2 py-1 bg-orange-50 border border-orange-200 rounded text-orange-700 text-xs"
      role="alert"
      aria-live="polite"
    >
      <i class="fas fa-exclamation-triangle text-orange-500"></i>
      <span>建议保存</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  saveStatus: SaveStatus
  saveMessage: string
  lastSaveTime: Date | null
  lastSaveTimeText: string
  isDirty: boolean
  isAutoSaveEnabled: boolean
  showSaveReminder?: boolean
}

interface Emits {
  (e: 'toggle-auto-save'): void
  (e: 'manual-save'): void
}

const props = withDefaults(defineProps<Props>(), {
  showSaveReminder: false
})

const emit = defineEmits<Emits>()

// 计算属性
const saveStatusIcon = computed(() => {
  switch (props.saveStatus) {
    case 'saving':
      return 'fas fa-spinner fa-spin'
    case 'saved':
      return 'fas fa-check'
    case 'error':
      return 'fas fa-exclamation-triangle'
    default:
      return props.isDirty ? 'fas fa-circle' : 'fas fa-save'
  }
})

const saveStatusColor = computed(() => {
  switch (props.saveStatus) {
    case 'saving':
      return 'text-blue-500'
    case 'saved':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    default:
      return props.isDirty ? 'text-orange-500' : 'text-gray-500'
  }
})

// 方法
const getDefaultStatusText = (): string => {
  switch (props.saveStatus) {
    case 'saving':
      return '保存中...'
    case 'saved':
      return '已保存'
    case 'error':
      return '保存失败'
    default:
      return props.isDirty ? '有未保存的更改' : '所有更改已保存'
  }
}

const getStatusTooltip = (): string => {
  const baseText = getDefaultStatusText()
  
  if (props.lastSaveTime && props.saveStatus !== 'saving') {
    return `${baseText} - ${props.lastSaveTimeText}`
  }
  
  return baseText
}

const toggleAutoSave = () => {
  emit('toggle-auto-save')
}

const handleManualSave = () => {
  if (props.saveStatus !== 'saving' && props.isDirty) {
    emit('manual-save')
  }
}
</script>

<style scoped>
.auto-save-indicator {
  user-select: none;
}

/* 动画效果 */
.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 按钮悬停效果 */
button {
  transition: all 0.15s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* 保存提醒动画 */
.bg-orange-50 {
  animation: pulse-orange 2s infinite;
}

@keyframes pulse-orange {
  0%, 100% {
    background-color: #fff7ed;
  }
  50% {
    background-color: #fed7aa;
  }
}

/* 状态指示器动画 */
.text-orange-500 .fa-circle {
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 成功状态动画 */
.text-green-500 .fa-check {
  animation: check-bounce 0.6s ease-out;
}

@keyframes check-bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 错误状态动画 */
.text-red-500 .fa-exclamation-triangle {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .auto-save-indicator {
    font-size: 0.8rem;
  }
  
  .text-xs {
    font-size: 0.7rem;
  }
  
  /* 移动端隐藏一些次要信息 */
  .text-gray-500 {
    display: none;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .text-orange-500 {
    color: #ea580c;
  }
  
  .text-green-500 {
    color: #16a34a;
  }
  
  .text-red-500 {
    color: #dc2626;
  }
  
  .text-blue-500 {
    color: #2563eb;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .fa-spin,
  .bg-orange-50,
  .text-orange-500 .fa-circle,
  .text-green-500 .fa-check,
  .text-red-500 .fa-exclamation-triangle,
  button {
    animation: none;
  }
  
  button:hover:not(:disabled) {
    transform: none;
  }
}
</style>
