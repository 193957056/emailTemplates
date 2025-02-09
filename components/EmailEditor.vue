<template>
  <div class="email-editor p-6 max-w-4xl mx-auto fixed-height">
    <!-- 标题输入框 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        <i class="fas fa-heading mr-2 text-blue-500"></i>
        邮件标题
      </label>
      <input
        v-model="title"
        type="text"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700"
        placeholder="请输入邮件标题"
      />
    </div>

    <!-- 内容编辑器 -->
    <div class="editor-container flex-grow">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        <i class="fas fa-pen-to-square mr-2 text-blue-500"></i>
        邮件内容
      </label>
      <div class="border border-gray-200 rounded-lg shadow-sm bg-white editor-wrapper">
        <!-- 工具栏 -->
        <div class="toolbar border-b border-gray-200 p-2 flex gap-2 bg-gray-50 rounded-t-lg">
          <div class="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              v-for="tool in formatTools"
              :key="tool.command"
              @click="executeCommand(tool.command)"
              class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
              :class="{ 'bg-blue-100 text-blue-600': isClient && isFormatActive(tool.command) }"
              :title="tool.label"
            >
              <i :class="tool.icon"></i>
            </button>
          </div>
          <div class="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              v-for="tool in alignTools"
              :key="tool.command"
              @click="executeCommand(tool.command)"
              class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
              :class="{ 'bg-blue-100 text-blue-600': isClient && isFormatActive(tool.command) }"
              :title="tool.label"
            >
              <i :class="tool.icon"></i>
            </button>
          </div>
          <div class="flex items-center gap-1 px-2">
            <div class="relative color-picker-container">
              <button
                class="p-2 hover:bg-gray-200 rounded transition-colors tooltip flex items-center gap-1"
                @click="handleColorPickerClick"
                title="文字颜色"
              >
                <i class="fas fa-palette"></i>
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
                  <div class="grid grid-cols-5 gap-2">
                    <button
                      v-for="color in commonColors"
                      :key="color.value"
                      class="w-8 h-8 rounded hover:opacity-80 transition-opacity relative group"
                      :style="{ backgroundColor: color.value }"
                      :title="color.label"
                      @click="setTextColor(color.value)"
                    >
                      <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <i class="fas fa-check text-white text-xs drop-shadow"></i>
                      </span>
                    </button>
                  </div>
                  <div class="pt-2 border-t border-gray-100">
                    <div class="text-xs text-gray-500 mb-2">更多颜色</div>
                    <div class="grid grid-cols-5 gap-2">
                      <button
                        v-for="color in extendedColors"
                        :key="color.value"
                        class="w-8 h-8 rounded hover:opacity-80 transition-opacity relative group"
                        :style="{ backgroundColor: color.value }"
                        :title="color.label"
                        @click="setTextColor(color.value)"
                      >
                        <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <i class="fas fa-check text-white text-xs drop-shadow"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  <!-- 自定义颜色部分 -->
                  <div class="pt-2 border-t border-gray-100">
                    <div class="text-xs text-gray-500 mb-2">自定义颜色</div>
                    <div class="flex flex-col gap-2">
                      <!-- 颜色选择器 -->
                      <div class="color-picker-wrapper">
                        <input
                          ref="colorWheel"
                          type="color"
                          v-model="customColor"
                          @input="handleCustomColorChange"
                        />
                      </div>
                      <!-- RGB 输入框 -->
                      <div class="flex items-center gap-2">
                        <div class="flex items-center gap-2">
                          <label class="text-xs text-gray-500">R</label>
                          <input
                            type="number"
                            v-model="rgbValues.r"
                            min="0"
                            max="255"
                            class="w-16 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            @input="updateFromRGB"
                          />
                        </div>
                        <div class="flex items-center gap-2">
                          <label class="text-xs text-gray-500">G</label>
                          <input
                            type="number"
                            v-model="rgbValues.g"
                            min="0"
                            max="255"
                            class="w-16 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            @input="updateFromRGB"
                          />
                        </div>
                        <div class="flex items-center gap-2">
                          <label class="text-xs text-gray-500">B</label>
                          <input
                            type="number"
                            v-model="rgbValues.b"
                            min="0"
                            max="255"
                            class="w-16 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            @input="updateFromRGB"
                          />
                        </div>
                        <button
                          class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors ml-auto"
                          @click="applyCustomColor"
                        >
                          确定
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 内容区域 -->
        <div
          ref="editor"
          contenteditable="true"
          class="editor-content p-6 focus:outline-none text-gray-700 leading-relaxed"
          @input="updateContent"
          placeholder="请输入邮件内容..."
        ></div>
      </div>
    </div>

    <!-- 底部工具栏 -->
    <div class="flex justify-between items-center bg-white mt-6">
      <div class="text-sm text-gray-500">
        <i class="fas fa-info-circle mr-1"></i>
        支持富文本编辑
      </div>
      <div class="flex items-center gap-3">
        <!-- 添加复制选项下拉框 -->
        <select 
          v-model="copyOption"
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        >
          <option value="all">复制全部</option>
          <option value="title">仅复制标题</option>
          <option value="content">仅复制内容</option>
        </select>
        
        <button
          @click="copyContent"
          class="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 shadow-sm"
        >
          <i class="fas fa-copy"></i>
          {{ copyStatus }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { EmailTemplate } from '~/types/email'

// 编辑器引用
const editor = ref<HTMLElement | null>(null)
const title = ref('')
const content = ref('')
const copyStatus = ref('复制')
const copyOption = ref('all') // 添加复制选项
const showColorPicker = ref(false)
const currentColor = ref('#000000')
const customColor = ref('#000000')
const colorWheel = ref<HTMLInputElement | null>(null)

// 使用 computed 来处理客户端状态
const isClient = computed(() => process.client)

// 编辑工具配置
const formatTools = [
  { label: '加粗', command: 'bold', icon: 'fas fa-bold' },
  { label: '斜体', command: 'italic', icon: 'fas fa-italic' },
  { label: '下划线', command: 'underline', icon: 'fas fa-underline' },
]

const alignTools = [
  { label: '左对齐', command: 'justifyLeft', icon: 'fas fa-align-left' },
  { label: '居中对齐', command: 'justifyCenter', icon: 'fas fa-align-center' },
  { label: '右对齐', command: 'justifyRight', icon: 'fas fa-align-right' }
]

// 常用颜色
const commonColors = [
  { label: '黑色', value: '#000000' },
  { label: '深灰', value: '#666666' },
  { label: '红色', value: '#FF0000' },
  { label: '蓝色', value: '#0000FF' },
  { label: '绿色', value: '#008000' },
]

// 扩展颜色
const extendedColors = [
  { label: '深红', value: '#8B0000' },
  { label: '橙色', value: '#FFA500' },
  { label: '紫色', value: '#800080' },
  { label: '棕色', value: '#A52A2A' },
  { label: '海蓝', value: '#1E90FF' },
  { label: '深绿', value: '#006400' },
  { label: '粉色', value: '#FF69B4' },
  { label: '青色', value: '#00CED1' },
  { label: '金色', value: '#FFD700' },
  { label: '深紫', value: '#4B0082' },
]

// 预定义的色调
const colorShades = [
  '#FF0000', // 红
  '#FF8C00', // 橙
  '#FFD700', // 金
  '#008000', // 绿
  '#0000FF', // 蓝
  '#4B0082', // 靛
  '#800080'  // 紫
]

// RGB 值
const rgbValues = ref({
  r: 0,
  g: 0,
  b: 0
})

// 执行编辑命令
function executeCommand(command: string) {
  if (isClient.value) {
    document.execCommand(command, false)
    editor.value?.focus()
  }
}

// 检查格式是否激活
function isFormatActive(command: string) {
  if (isClient.value) {
    return document.queryCommandState(command)
  }
  return false
}

// 更新内容
function updateContent(e: Event) {
  const target = e.target as HTMLElement
  content.value = target.innerHTML
}

// 修改复制方法
async function copyContent() {
  try {
    let textToCopy = ''
    let htmlContent = ''
    
    switch (copyOption.value) {
      case 'title':
        textToCopy = title.value
        htmlContent = title.value
        break
      case 'content':
        textToCopy = editor.value?.innerText || ''
        htmlContent = editor.value?.innerHTML || ''
        break
      case 'all':
      default:
        textToCopy = `${title.value}\n\n${editor.value?.innerText || ''}`
        htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="font-size: 1.1em; font-weight: 500; margin-bottom: 16px;">
              ${title.value}
            </div>
            <div>
              ${editor.value?.innerHTML || ''}
            </div>
          </div>
        `
        break
    }
    
    try {
      // 尝试使用新的 Clipboard API
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([textToCopy], { type: 'text/plain' }),
        'text/html': new Blob([htmlContent], { type: 'text/html' })
      })
      await navigator.clipboard.write([clipboardItem])
    } catch {
      // 降级处理：使用传统方法
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent
      tempDiv.style.position = 'fixed'
      tempDiv.style.left = '-9999px'
      document.body.appendChild(tempDiv)
      
      const range = document.createRange()
      range.selectNode(tempDiv)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      
      document.execCommand('copy')
      document.body.removeChild(tempDiv)
      selection?.removeAllRanges()
    }
    
    copyStatus.value = '复制成功'
    setTimeout(() => {
      copyStatus.value = '复制'
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    copyStatus.value = '复制失败'
    setTimeout(() => {
      copyStatus.value = '复制'
    }, 2000)
  }
}

// 添加应用模板方法
function applyTemplate(template: EmailTemplate) {
  title.value = template.title
  if (editor.value) {
    editor.value.innerHTML = template.content
    content.value = template.content
  }
}

// 修改设置文字颜色的函数
function setTextColor(color: string) {
  if (!isClient.value) return
  
  currentColor.value = color
  
  // 保存当前选区
  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)
  
  // 如果没有选中文本，就选中光标所在位置
  if (selection?.isCollapsed) {
    const span = document.createElement('span')
    span.style.color = color
    span.textContent = '\u200B' // 零宽空格
    
    if (range) {
      range.insertNode(span)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  } else {
    // 如果有选中的文本，直接应用颜色
    document.execCommand('foreColor', false, color)
  }
  
  showColorPicker.value = false
  editor.value?.focus()
  
  // 更新内容
  if (editor.value) {
    content.value = editor.value.innerHTML
  }
}

// 修改点击事件处理
function handleColorPickerClick(event: MouseEvent) {
  event.stopPropagation() // 阻止事件冒泡
  showColorPicker.value = !showColorPicker.value
}

// 修改 onMounted
onMounted(() => {
  // 点击其他地方关闭颜色选择器
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.color-picker-container')) {
      showColorPicker.value = false
    }
  })
})

// 处理自定义颜色变化
function handleCustomColorChange(event: Event) {
  const input = event.target as HTMLInputElement
  customColor.value = input.value
  updateRGBFromHex(input.value)
}

// 从十六进制更新 RGB 值
function updateRGBFromHex(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    rgbValues.value = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
  }
}

// 从 RGB 更新十六进制值
function updateFromRGB() {
  const { r, g, b } = rgbValues.value
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, n)).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  customColor.value = `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// 应用自定义颜色
function applyCustomColor() {
  setTextColor(customColor.value)
}

// 暴露方法给父组件
defineExpose({
  applyTemplate
})
</script>

<style scoped>
.email-editor {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
  cursor: text;
}

[contenteditable]:focus:before {
  content: '';
}

/* 固定高度容器 */
.fixed-height {
  height: calc(100vh - 180px); /* 减去头部和边距的高度 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 编辑器容器样式 */
.editor-container {
  position: relative;
  min-height: 0; /* 允许容器缩小 */
  display: flex;
  flex-direction: column;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; /* 允许容器缩小 */
}

.toolbar {
  flex-shrink: 0;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 1.5rem;
  word-break: break-word;
  background: white;
}

/* 移除之前的 sticky 相关样式 */
.border-b {
  background: #f9fafb;
}

/* 自定义滚动条样式 */
.editor-content {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.editor-content::-webkit-scrollbar {
  width: 6px;
}

.editor-content::-webkit-scrollbar-track {
  background: transparent;
}

.editor-content::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 3px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background-color: #D1D5DB;
}

/* 工具栏按钮激活状态 */
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
}

/* 添加下拉框样式 */
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* 颜色选择器样式 */
.color-picker-enter-active,
.color-picker-leave-active {
  transition: all 0.2s ease;
}

.color-picker-enter-from,
.color-picker-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 颜色按钮悬浮效果 */
.color-picker-container button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* 添加阴影效果 */
.drop-shadow {
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
}

/* 自定义颜色输入框样式 */
input[type="color"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0;
  border: none;
}

/* 数字输入框样式 */
input[type="number"] {
  appearance: textfield;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}

/* 颜色选择器包装器 */
.color-picker-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

/* 颜色选择器样式 */
.color-picker-wrapper input[type="color"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;
}

/* Webkit (Chrome, Safari) 样式 */
.color-picker-wrapper input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker-wrapper input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 8px;
}

/* Firefox 样式 */
.color-picker-wrapper input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 8px;
}

/* 数字输入框样式 */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}
</style> 