<template>
  <div class="toolbar border-b border-white/30 p-4 flex flex-wrap gap-2 bg-white/60 backdrop-blur-sm rounded-t-xl shadow-inner">
    <!-- 文本格式工具 -->
    <div class="flex items-center gap-1 px-2 border-r border-white/30">
      <button
        v-for="tool in formatTools"
        :key="tool.command"
        @click="executeCommand(tool.command)"
        class="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 tooltip backdrop-blur-sm border border-transparent hover:border-white/50 hover:shadow-md"
        :class="{ 'bg-purple-100 text-purple-700 border-purple-200 shadow-md': isFormatActive(tool.command) }"
        :title="tool.label"
        :aria-label="tool.label"
        :aria-pressed="isFormatActive(tool.command)"
        role="button"
        tabindex="0"
        @keydown.enter="executeCommand(tool.command)"
      >
        <i :class="tool.icon" aria-hidden="true"></i>
      </button>
    </div>
    
    <!-- 对齐工具 -->
    <div class="flex items-center gap-1 px-2 border-r border-white/30">
      <button
        v-for="tool in alignTools"
        :key="tool.command"
        @click="executeCommand(tool.command)"
        class="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 tooltip backdrop-blur-sm border border-transparent hover:border-white/50 hover:shadow-md"
        :class="{ 'bg-purple-100 text-purple-700 border-purple-200 shadow-md': isFormatActive(tool.command) }"
        :title="tool.label"
        :aria-label="tool.label"
        :aria-pressed="isFormatActive(tool.command)"
        role="button"
        tabindex="0"
        @keydown.enter="executeCommand(tool.command)"
      >
        <i :class="tool.icon" aria-hidden="true"></i>
      </button>
    </div>
    
    <!-- 列表工具 -->
    <div class="flex items-center gap-1 px-2 border-r border-white/30">
      <button
        v-for="tool in listTools"
        :key="tool.command"
        @click="executeCommand(tool.command)"
        class="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 tooltip backdrop-blur-sm border border-transparent hover:border-white/50 hover:shadow-md"
        :class="{ 'bg-purple-100 text-purple-700 border-purple-200 shadow-md': isFormatActive(tool.command) }"
        :title="tool.label"
        :aria-label="tool.label"
        :aria-pressed="isFormatActive(tool.command)"
        role="button"
        tabindex="0"
        @keydown.enter="executeCommand(tool.command)"
      >
        <i :class="tool.icon" aria-hidden="true"></i>
      </button>
    </div>
    
    <!-- 缩进工具 -->
    <div class="flex items-center gap-1 px-2 border-r border-white/30">
      <button
        v-for="tool in indentTools"
        :key="tool.command"
        @click="executeCommand(tool.command)"
        class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
        :title="tool.label"
        :aria-label="tool.label"
        role="button"
        tabindex="0"
        @keydown.enter="executeCommand(tool.command)"
      >
        <i :class="tool.icon" aria-hidden="true"></i>
      </button>
    </div>
    
    <!-- 标题级别选择 -->
    <div class="flex items-center gap-1 px-2 border-r border-white/30">
      <select
        @change="applyHeading($event)"
        class="p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="标题级别"
        aria-label="选择标题级别"
      >
        <option value="">标题级别</option>
        <option value="h1">标题 1</option>
        <option value="h2">标题 2</option>
        <option value="h3">标题 3</option>
        <option value="h4">标题 4</option>
        <option value="p">正文</option>
      </select>
    </div>
    
    <!-- 字体大小选择 -->
    <div class="flex items-center gap-1 px-2 border-r border-white/30">
      <select
        @change="applyFontSize($event)"
        class="p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="字体大小"
        aria-label="选择字体大小"
      >
        <option value="">字体大小</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
      </select>
    </div>
    
    <!-- 插入工具 -->
    <div class="flex items-center gap-1 px-2 border-r border-white/30">
      <button
        @click="$emit('show-link-dialog')"
        class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
        title="插入链接"
        aria-label="插入链接"
      >
        <i class="fas fa-link" aria-hidden="true"></i>
      </button>
      
      <button
        @click="insertHorizontalRule"
        class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
        title="插入分割线"
        aria-label="插入分割线"
      >
        <i class="fas fa-minus" aria-hidden="true"></i>
      </button>
      
      <button
        @click="$emit('show-table-dialog')"
        class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
        title="插入表格"
        aria-label="插入表格"
      >
        <i class="fas fa-table" aria-hidden="true"></i>
      </button>
      
      <button
        @click="clearFormatting"
        class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
        title="清除格式"
        aria-label="清除格式"
      >
        <i class="fas fa-eraser" aria-hidden="true"></i>
      </button>
    </div>
    
    <!-- 颜色选择器 -->
    <div class="flex items-center gap-1 px-2">
      <ColorPicker
        @color-selected="setTextColor"
        :current-color="currentColor"
        type="text"
      />
      
      <ColorPicker
        @color-selected="setBackgroundColor"
        :current-color="currentBgColor"
        type="background"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ToolbarTool } from '~/types/email'
import ColorPicker from './ColorPicker.vue'

interface Props {
  currentColor: string
  currentBgColor: string
}

interface Emits {
  (e: 'execute-command', command: string): void
  (e: 'apply-heading', event: Event): void
  (e: 'apply-font-size', event: Event): void
  (e: 'set-text-color', color: string): void
  (e: 'set-background-color', color: string): void
  (e: 'insert-horizontal-rule'): void
  (e: 'clear-formatting'): void
  (e: 'show-link-dialog'): void
  (e: 'show-table-dialog'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用 computed 来处理客户端状态
const isClient = computed(() => import.meta.client)

// 编辑工具配置
const formatTools: ToolbarTool[] = [
  { label: '加粗', command: 'bold', icon: 'fas fa-bold', category: 'format' },
  { label: '斜体', command: 'italic', icon: 'fas fa-italic', category: 'format' },
  { label: '下划线', command: 'underline', icon: 'fas fa-underline', category: 'format' },
]

const alignTools: ToolbarTool[] = [
  { label: '左对齐', command: 'justifyLeft', icon: 'fas fa-align-left', category: 'align' },
  { label: '居中对齐', command: 'justifyCenter', icon: 'fas fa-align-center', category: 'align' },
  { label: '右对齐', command: 'justifyRight', icon: 'fas fa-align-right', category: 'align' }
]

const listTools: ToolbarTool[] = [
  { label: '无序列表', command: 'insertUnorderedList', icon: 'fas fa-list-ul', category: 'list' },
  { label: '有序列表', command: 'insertOrderedList', icon: 'fas fa-list-ol', category: 'list' }
]

const indentTools: ToolbarTool[] = [
  { label: '减少缩进', command: 'outdent', icon: 'fas fa-outdent', category: 'indent' },
  { label: '增加缩进', command: 'indent', icon: 'fas fa-indent', category: 'indent' }
]

// 执行编辑命令
function executeCommand(command: string) {
  emit('execute-command', command)
}

// 检查格式是否激活
function isFormatActive(command: string) {
  if (isClient.value) {
    return document.queryCommandState(command)
  }
  return false
}

// 应用标题级别
function applyHeading(event: Event) {
  emit('apply-heading', event)
}

// 应用字体大小
function applyFontSize(event: Event) {
  emit('apply-font-size', event)
}

// 设置文字颜色
function setTextColor(color: string) {
  emit('set-text-color', color)
}

// 设置背景颜色
function setBackgroundColor(color: string) {
  emit('set-background-color', color)
}

// 插入分割线
function insertHorizontalRule() {
  emit('insert-horizontal-rule')
}

// 清除格式
function clearFormatting() {
  emit('clear-formatting')
}
</script>

<style scoped>
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
