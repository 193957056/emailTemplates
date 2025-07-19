<template>
  <div class="relative color-picker-container">
    <button
      class="p-2 hover:bg-gray-200 rounded transition-colors tooltip flex items-center gap-1"
      @click="handleColorPickerClick"
      :title="type === 'text' ? '文字颜色' : '背景颜色'"
      :aria-label="type === 'text' ? '选择文字颜色' : '选择背景颜色'"
    >
      <i :class="type === 'text' ? 'fas fa-palette' : 'fas fa-fill-drip'" aria-hidden="true"></i>
      <div 
        class="w-3 h-3 rounded-sm border border-gray-300" 
        :style="{ backgroundColor: currentColor }"
      ></div>
    </button>
    
    <!-- 颜色选择面板 -->
    <div
      v-if="showColorPicker"
      class="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[240px]"
      @click.stop
    >
      <div class="mb-3 pb-2 border-b border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-500">当前颜色</span>
          <div class="flex items-center gap-2">
            <div 
              class="w-6 h-6 rounded border border-gray-200"
              :style="{ backgroundColor: currentColor }"
            ></div>
            <span class="text-xs text-gray-500">{{ currentColor.toUpperCase() }}</span>
          </div>
        </div>
      </div>
      
      <div class="space-y-2">
        <!-- 常用颜色 -->
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="color in colorOptions"
            :key="color.value"
            class="w-8 h-8 rounded hover:opacity-80 transition-opacity relative group"
            :style="{ backgroundColor: color.value }"
            :title="color.label"
            :aria-label="`选择颜色 ${color.label}`"
            @click="selectColor(color.value)"
          >
            <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <i class="fas fa-check text-white text-xs drop-shadow" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        
        <!-- 自定义颜色 -->
        <div class="pt-2 border-t border-gray-100">
          <div class="text-xs text-gray-500 mb-2">自定义颜色</div>
          <div class="flex items-center gap-2">
            <input
              ref="colorInput"
              type="color"
              v-model="customColor"
              @input="handleCustomColorChange"
              class="w-8 h-8 rounded border border-gray-200 cursor-pointer"
              :aria-label="type === 'text' ? '自定义文字颜色' : '自定义背景颜色'"
            />
            <button
              class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              @click="selectColor(customColor)"
            >
              应用
            </button>
          </div>
        </div>
        
        <!-- 背景颜色特有的清除选项 -->
        <div v-if="type === 'background'" class="pt-2 border-t border-gray-100">
          <button
            class="w-full px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
            @click="clearColor"
          >
            清除背景色
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ColorOption } from '~/types/email'

interface Props {
  currentColor: string
  type: 'text' | 'background'
}

interface Emits {
  (e: 'color-selected', color: string): void
  (e: 'color-cleared'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showColorPicker = ref(false)
const customColor = ref('#000000')
const colorInput = ref<HTMLInputElement | null>(null)

// 颜色选项配置
const colorOptions: ColorOption[] = [
  { label: '黑色', value: '#000000', category: 'common' },
  { label: '深灰', value: '#666666', category: 'common' },
  { label: '红色', value: '#FF0000', category: 'common' },
  { label: '蓝色', value: '#0000FF', category: 'common' },
  { label: '绿色', value: '#008000', category: 'common' },
  { label: '深红', value: '#8B0000', category: 'extended' },
  { label: '橙色', value: '#FFA500', category: 'extended' },
  { label: '紫色', value: '#800080', category: 'extended' },
  { label: '棕色', value: '#A52A2A', category: 'extended' },
  { label: '海蓝', value: '#1E90FF', category: 'extended' },
  { label: '深绿', value: '#006400', category: 'extended' },
  { label: '粉色', value: '#FF69B4', category: 'extended' },
  { label: '青色', value: '#00CED1', category: 'extended' },
  { label: '金色', value: '#FFD700', category: 'extended' },
  { label: '深紫', value: '#4B0082', category: 'extended' },
]

// 如果是背景颜色，添加背景色选项
if (props.type === 'background') {
  colorOptions.push(
    { label: '白色', value: '#FFFFFF', category: 'common' },
    { label: '浅灰', value: '#F5F5F5', category: 'common' },
    { label: '浅黄', value: '#FFF9C4', category: 'extended' },
    { label: '浅蓝', value: '#E3F2FD', category: 'extended' },
    { label: '浅绿', value: '#E8F5E9', category: 'extended' }
  )
}

// 处理颜色选择器点击
function handleColorPickerClick(event: MouseEvent) {
  event.stopPropagation()
  showColorPicker.value = !showColorPicker.value
}

// 选择颜色
function selectColor(color: string) {
  emit('color-selected', color)
  showColorPicker.value = false
}

// 清除颜色（仅背景色）
function clearColor() {
  emit('color-cleared')
  showColorPicker.value = false
}

// 处理自定义颜色变化
function handleCustomColorChange(event: Event) {
  const input = event.target as HTMLInputElement
  customColor.value = input.value
}

// 处理点击其他地方关闭颜色选择器
function handleDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.color-picker-container')) {
    showColorPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.color-picker-container {
  position: relative;
}

.tooltip {
  position: relative;
}

.tooltip:hover:after {
  content: attr(title);
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}
</style>
