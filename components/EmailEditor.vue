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
        <div class="toolbar border-b border-gray-200 p-2 flex flex-wrap gap-2 bg-gray-50 rounded-t-lg">
          <!-- 文本格式工具 -->
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
          
          <!-- 对齐工具 -->
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
          
          <!-- 列表工具 -->
          <div class="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              v-for="tool in listTools"
              :key="tool.command"
              @click="executeCommand(tool.command)"
              class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
              :class="{ 'bg-blue-100 text-blue-600': isClient && isFormatActive(tool.command) }"
              :title="tool.label"
            >
              <i :class="tool.icon"></i>
            </button>
          </div>
          
          <!-- 缩进工具 -->
          <div class="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              v-for="tool in indentTools"
              :key="tool.command"
              @click="executeCommand(tool.command)"
              class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
              :title="tool.label"
            >
              <i :class="tool.icon"></i>
            </button>
          </div>
          
          <!-- 标题级别选择 -->
          <div class="flex items-center gap-1 px-2 border-r border-gray-200">
            <select
              @change="applyHeading($event)"
              class="p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="标题级别"
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
          <div class="flex items-center gap-1 px-2 border-r border-gray-200">
            <select
              @change="applyFontSize($event)"
              class="p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="字体大小"
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
          <div class="flex items-center gap-1 px-2 border-r border-gray-200">
            <!-- 插入链接 -->
            <button
              @click="showLinkDialog = true"
              class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
              title="插入链接"
            >
              <i class="fas fa-link"></i>
            </button>
            
            <!-- 插入分割线 -->
            <button
              @click="insertHorizontalRule"
              class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
              title="插入分割线"
            >
              <i class="fas fa-minus"></i>
            </button>
            
            <!-- 插入表格 -->
            <button
              @click="showTableDialog = true"
              class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
              title="插入表格"
            >
              <i class="fas fa-table"></i>
            </button>
            
            <!-- 清除格式 -->
            <button
              @click="clearFormatting"
              class="p-2 hover:bg-gray-200 rounded transition-colors tooltip"
              title="清除格式"
            >
              <i class="fas fa-eraser"></i>
            </button>
          </div>
          
          <!-- 文字颜色选择器 -->
          <div class="flex items-center gap-1 px-2 border-r border-gray-200">
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
          
          <!-- 背景颜色选择器 -->
          <div class="flex items-center gap-1 px-2">
            <div class="relative bg-color-picker-container">
              <button
                class="p-2 hover:bg-gray-200 rounded transition-colors tooltip flex items-center gap-1"
                @click="handleBgColorPickerClick"
                title="背景颜色"
              >
                <i class="fas fa-fill-drip"></i>
                <div 
                  class="w-3 h-3 rounded-sm border border-gray-300" 
                  :style="{ backgroundColor: currentBgColor }"
                ></div>
              </button>
              
              <!-- 背景颜色选择面板 -->
              <div
                v-if="showBgColorPicker"
                class="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[240px]"
                @click.stop
              >
                <div class="mb-3 pb-2 border-b border-gray-100">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-gray-500">当前背景色</span>
                    <div class="flex items-center gap-2">
                      <div 
                        class="w-6 h-6 rounded border border-gray-200"
                        :style="{ backgroundColor: currentBgColor }"
                      ></div>
                      <span class="text-xs text-gray-500">{{ currentBgColor.toUpperCase() }}</span>
                    </div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="grid grid-cols-5 gap-2">
                    <button
                      v-for="color in bgColors"
                      :key="color.value"
                      class="w-8 h-8 rounded hover:opacity-80 transition-opacity relative group"
                      :style="{ backgroundColor: color.value }"
                      :title="color.label"
                      @click="setBackgroundColor(color.value)"
                    >
                      <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <i class="fas fa-check text-white text-xs drop-shadow"></i>
                      </span>
                    </button>
                  </div>
                  <div class="pt-2 border-t border-gray-100">
                    <button
                      class="w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      @click="removeBackgroundColor"
                    >
                      清除背景色
                    </button>
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
          data-placeholder="请输入邮件内容..."
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

    <!-- 链接对话框 -->
    <div v-if="showLinkDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
        <h3 class="text-lg font-semibold mb-4">插入链接</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">链接文本</label>
            <input 
              v-model="linkText" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="显示的文本"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">链接地址</label>
            <input 
              v-model="linkUrl" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button 
              @click="showLinkDialog = false" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              @click="insertLink" 
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              插入
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格对话框 -->
    <div v-if="showTableDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
        <h3 class="text-lg font-semibold mb-4">插入表格</h3>
        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">行数</label>
              <input 
                v-model="tableRows" 
                type="number" 
                min="1" 
                max="10" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">列数</label>
              <input 
                v-model="tableCols" 
                type="number" 
                min="1" 
                max="10" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button 
              @click="showTableDialog = false" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              @click="insertTable" 
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              插入
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { EmailTemplate } from '~/types/email'

// 编辑器引用
const editor = ref<HTMLElement | null>(null)
const title = ref('')
const content = ref('')
const copyStatus = ref('复制')
const copyOption = ref('all') // 添加复制选项
const showColorPicker = ref(false)
const showBgColorPicker = ref(false) // 背景色选择器显示状态
const currentColor = ref('#000000')
const currentBgColor = ref('#ffffff') // 当前背景色
const customColor = ref('#000000')
const colorWheel = ref<HTMLInputElement | null>(null)
const showLinkDialog = ref(false)
const showTableDialog = ref(false)
const linkText = ref('')
const linkUrl = ref('')
const tableRows = ref(1)
const tableCols = ref(1)

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

// 新增列表工具
const listTools = [
  { label: '无序列表', command: 'insertUnorderedList', icon: 'fas fa-list-ul' },
  { label: '有序列表', command: 'insertOrderedList', icon: 'fas fa-list-ol' }
]

// 新增缩进工具
const indentTools = [
  { label: '减少缩进', command: 'outdent', icon: 'fas fa-outdent' },
  { label: '增加缩进', command: 'indent', icon: 'fas fa-indent' }
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

// 背景颜色选项
const bgColors = [
  { label: '白色', value: '#FFFFFF' },
  { label: '浅灰', value: '#F5F5F5' },
  { label: '浅黄', value: '#FFF9C4' },
  { label: '浅蓝', value: '#E3F2FD' },
  { label: '浅绿', value: '#E8F5E9' },
  { label: '浅粉', value: '#FCE4EC' },
  { label: '浅紫', value: '#F3E5F5' },
  { label: '浅青', value: '#E0F7FA' },
  { label: '浅橙', value: '#FFF3E0' },
  { label: '浅棕', value: '#EFEBE9' }
]

// 执行编辑命令
function executeCommand(command: string) {
  if (!isClient.value || !editor.value) return
  
  // 确保编辑器获得焦点
  editor.value.focus()
  
  // 如果没有选区，对于列表命令，需要特殊处理
  if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
    const selection = window.getSelection()
    if (selection && selection.isCollapsed) {
      // 如果光标在空位置，先插入一个空段落
      const currentNode = selection.anchorNode
      if (currentNode === editor.value || 
          (currentNode?.nodeType === Node.TEXT_NODE && currentNode.textContent?.trim() === '')) {
        document.execCommand('insertParagraph', false)
      }
    }
  }
  
  // 执行命令
  document.execCommand(command, false)
  
  // 更新内容
  if (editor.value) {
    content.value = editor.value.innerHTML
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
    
    // 传统复制方法
    function useTraditionalCopy() {
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
      
      const successful = document.execCommand('copy')
      document.body.removeChild(tempDiv)
      selection?.removeAllRanges()
      
      copyStatus.value = successful ? '复制成功' : '复制失败'
    }
    
    // 检查是否支持新的 Clipboard API
    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const clipboardItem = new ClipboardItem({
          'text/plain': new Blob([textToCopy], { type: 'text/plain' }),
          'text/html': new Blob([htmlContent], { type: 'text/html' })
        })
        await navigator.clipboard.write([clipboardItem])
        copyStatus.value = '复制成功'
      } catch (err) {
        console.warn('高级剪贴板 API 失败，使用降级方法', err)
        useTraditionalCopy()
      }
    } else {
      // 浏览器不支持新 API，使用传统方法
      useTraditionalCopy()
    }
    
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
  content.value = template.content
  
  // 确保在客户端环境下才操作 DOM
  if (process.client && editor.value) {
    // 使用 nextTick 确保 DOM 更新
    nextTick(() => {
      if (editor.value) {
        editor.value.innerHTML = template.content
      }
    })
  }
}

// 修改设置文字颜色的函数
function setTextColor(color: string) {
  if (!isClient.value || !editor.value) return
  
  currentColor.value = color
  
  // 保存当前选区
  const selection = window.getSelection()
  if (!selection) return
  
  // 如果没有选中文本，创建一个新的空白 span 并设置颜色
  if (selection.isCollapsed) {
    // 创建一个带颜色的 span
    const colorSpan = document.createElement('span')
    colorSpan.style.color = color
    
    // 插入一个空格作为可见内容
    colorSpan.textContent = ' '
    
    // 插入 span
    document.execCommand('insertHTML', false, colorSpan.outerHTML)
    
    // 将光标移动到新插入的 span 后面
    const range = selection.getRangeAt(0)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    // 如果有选中的文本，直接应用颜色
    document.execCommand('foreColor', false, color)
  }
  
  showColorPicker.value = false
  editor.value.focus()
  
  // 更新内容
  content.value = editor.value.innerHTML
}

// 修改点击事件处理
function handleColorPickerClick(event: MouseEvent) {
  event.stopPropagation() // 阻止事件冒泡
  showColorPicker.value = !showColorPicker.value
}

// 处理点击其他地方关闭颜色选择器的函数
function handleDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.color-picker-container')) {
    showColorPicker.value = false
  }
  if (!target.closest('.bg-color-picker-container')) {
    showBgColorPicker.value = false
  }
}

// 修改 onMounted
onMounted(() => {
  // 点击其他地方关闭颜色选择器
  document.addEventListener('click', handleDocumentClick)
  
  // 初始化编辑器内容
  if (editor.value && content.value) {
    // 使用 nextTick 确保 DOM 已更新
    nextTick(() => {
      if (editor.value) {
        editor.value.innerHTML = content.value
      }
    })
  }
})

// 添加 onUnmounted 钩子
onUnmounted(() => {
  // 移除事件监听器
  document.removeEventListener('click', handleDocumentClick)
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

// 应用标题级别
function applyHeading(event: Event) {
  if (!isClient.value || !editor.value) return
  
  const target = event.target as HTMLSelectElement
  const value = target.value
  
  // 确保编辑器获得焦点
  editor.value.focus()
  
  // 保存当前选区
  const selection = window.getSelection()
  if (!selection) return
  
  // 如果没有选中文本，需要确保光标位置有内容
  if (selection.isCollapsed) {
    // 获取当前段落或创建一个新段落
    const currentNode = selection.anchorNode
    if (currentNode === editor.value || !currentNode) {
      // 如果光标在编辑器根节点，先插入一个段落
      document.execCommand('insertParagraph', false)
    }
  }
  
  if (value) {
    // 应用标题样式
    document.execCommand('formatBlock', false, `<${value}>`)
  } else {
    // 恢复为正文
    document.execCommand('formatBlock', false, '<p>')
  }
  
  // 重置选择框
  setTimeout(() => {
    target.value = ''
  }, 100)
  
  // 更新内容
  content.value = editor.value.innerHTML
}

// 应用字体大小
function applyFontSize(event: Event) {
  if (!isClient.value || !editor.value) return
  
  const target = event.target as HTMLSelectElement
  const fontSize = target.value
  
  // 确保编辑器获得焦点
  editor.value.focus()
  
  // 保存当前选区
  const selection = window.getSelection()
  if (!selection) return
  
  if (fontSize) {
    if (selection.isCollapsed) {
      // 如果没有选中文本，创建一个带字体大小的 span
      const span = document.createElement('span')
      span.style.fontSize = fontSize
      span.innerHTML = '&nbsp;'
      
      // 插入 span
      const range = selection.getRangeAt(0)
      range.insertNode(span)
      
      // 将光标移动到新插入的 span 后面
      range.setStartAfter(span)
      range.setEndAfter(span)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      // 如果有选中的文本，使用 span 包裹并设置字体大小
      const range = selection.getRangeAt(0)
      const selectedContent = range.extractContents()
      
      const span = document.createElement('span')
      span.style.fontSize = fontSize
      span.appendChild(selectedContent)
      
      range.insertNode(span)
      
      // 选中新插入的内容
      range.selectNode(span)
      selection.removeAllRanges()
      selection.addRange(range)
      
      // 将光标移动到内容后面
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
  
  // 重置选择框
  setTimeout(() => {
    target.value = ''
  }, 100)
  
  // 更新内容
  content.value = editor.value.innerHTML
}

// 设置背景颜色
function setBackgroundColor(color: string) {
  if (!isClient.value || !editor.value) return
  
  currentBgColor.value = color
  
  // 确保编辑器获得焦点
  editor.value.focus()
  
  // 保存当前选区
  const selection = window.getSelection()
  if (!selection) return
  
  if (selection.isCollapsed) {
    // 如果没有选中文本，创建一个带背景色的 span
    const span = document.createElement('span')
    span.style.backgroundColor = color
    span.innerHTML = '&nbsp;'
    
    // 插入 span
    const range = selection.getRangeAt(0)
    range.insertNode(span)
    
    // 将光标移动到新插入的 span 后面
    range.setStartAfter(span)
    range.setEndAfter(span)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    // 如果有选中的文本，使用 backColor 命令（在某些浏览器中更可靠）
    try {
      // 首先尝试 hiliteColor（标准命令）
      document.execCommand('hiliteColor', false, color)
    } catch (e) {
      // 如果失败，尝试 backColor（IE 支持）
      try {
        document.execCommand('backColor', false, color)
      } catch (e2) {
        // 如果两种方法都失败，使用手动方法
        const range = selection.getRangeAt(0)
        const selectedContent = range.extractContents()
        
        const span = document.createElement('span')
        span.style.backgroundColor = color
        span.appendChild(selectedContent)
        
        range.insertNode(span)
      }
    }
  }
  
  showBgColorPicker.value = false
  
  // 更新内容
  content.value = editor.value.innerHTML
}

// 移除背景颜色
function removeBackgroundColor() {
  if (!isClient.value || !editor.value) return
  
  // 确保编辑器获得焦点
  editor.value.focus()
  
  // 保存当前选区
  const selection = window.getSelection()
  if (!selection) return
  
  if (!selection.isCollapsed) {
    try {
      // 尝试使用 hiliteColor 命令设置透明背景
      document.execCommand('hiliteColor', false, 'transparent')
    } catch (e) {
      try {
        // 如果失败，尝试 backColor
        document.execCommand('backColor', false, 'transparent')
      } catch (e2) {
        // 如果两种方法都失败，使用手动方法
        const range = selection.getRangeAt(0)
        const fragment = range.cloneContents()
        
        // 创建一个临时容器
        const tempDiv = document.createElement('div')
        tempDiv.appendChild(fragment)
        
        // 移除所有背景色
        const spans = tempDiv.querySelectorAll('span[style*="background"]')
        spans.forEach(span => {
          // 使用 HTMLElement 类型断言
          const htmlSpan = span as HTMLElement
          htmlSpan.style.backgroundColor = ''
        })
        
        // 清除选区内容并插入处理后的内容
        range.deleteContents()
        range.insertNode(tempDiv.firstChild as Node)
      }
    }
  }
  
  showBgColorPicker.value = false
  
  // 更新内容
  content.value = editor.value.innerHTML
}

// 处理背景色选择器点击
function handleBgColorPickerClick(event: MouseEvent) {
  event.stopPropagation() // 阻止事件冒泡
  showBgColorPicker.value = !showBgColorPicker.value
  showColorPicker.value = false // 关闭文字颜色选择器
}

// 插入链接
function insertLink() {
  if (!isClient.value || !editor.value) return
  
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed) return
  
  const range = selection.getRangeAt(0)
  const link = document.createElement('a')
  link.href = linkUrl.value
  link.textContent = linkText.value
  link.style.color = currentColor.value
  link.style.textDecoration = 'underline'
  
  const span = document.createElement('span')
  span.appendChild(link)
  
  range.deleteContents()
  range.insertNode(span)
  
  showLinkDialog.value = false
  editor.value.focus()
  content.value = editor.value.innerHTML
}

// 插入分割线
function insertHorizontalRule() {
  if (!isClient.value || !editor.value) return
  
  const selection = window.getSelection()
  if (!selection) return
  
  // 创建一个新的范围
  const range = document.createRange()
  range.selectNodeContents(editor.value)
  
  const hr = document.createElement('hr')
  hr.style.border = 'none'
  hr.style.height = '1px'
  hr.style.background = '#cccccc'
  
  // 插入到当前光标位置
  selection.getRangeAt(0).insertNode(hr)
  
  editor.value.focus()
  content.value = editor.value.innerHTML
}

// 插入表格
function insertTable() {
  if (!isClient.value || !editor.value) return
  
  const selection = window.getSelection()
  if (!selection) return
  
  // 创建一个新的范围
  const range = selection.getRangeAt(0)
  
  const table = document.createElement('table')
  table.style.borderCollapse = 'collapse'
  table.style.width = '100%'
  
  const tbody = document.createElement('tbody')
  for (let i = 0; i < tableRows.value; i++) {
    const tr = document.createElement('tr')
    for (let j = 0; j < tableCols.value; j++) {
      const td = document.createElement('td')
      td.style.border = '1px solid #dddddd'
      td.style.padding = '8px'
      td.innerHTML = '&nbsp;'
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  }
  
  table.appendChild(tbody)
  
  // 插入表格
  range.deleteContents()
  range.insertNode(table)
  
  showTableDialog.value = false
  editor.value.focus()
  content.value = editor.value.innerHTML
}

// 清除格式
function clearFormatting() {
  if (!isClient.value || !editor.value) return
  
  // 确保编辑器获得焦点
  editor.value.focus()
  
  // 保存当前选区
  const selection = window.getSelection()
  if (!selection) return
  
  if (!selection.isCollapsed) {
    try {
      // 使用 removeFormat 命令清除基本格式
      document.execCommand('removeFormat', false)
      
      // 额外清除一些可能未被 removeFormat 清除的格式
      document.execCommand('unlink', false) // 移除链接
      
      // 尝试清除背景色
      try {
        document.execCommand('hiliteColor', false, 'transparent')
      } catch (e) {
        try {
          document.execCommand('backColor', false, 'transparent')
        } catch (e2) {
          // 忽略错误
        }
      }
      
      // 重置文字颜色
      document.execCommand('foreColor', false, '#000000')
      
      // 重置为正文段落
      document.execCommand('formatBlock', false, '<p>')
    } catch (e) {
      // 如果命令执行失败，使用手动方法
      const range = selection.getRangeAt(0)
      const fragment = range.cloneContents()
      
      // 创建一个临时容器
      const tempDiv = document.createElement('div')
      tempDiv.appendChild(fragment)
      
      // 递归清除所有格式
      function cleanFormatting(element: HTMLElement) {
        // 如果是文本节点，直接返回
        if (element.nodeType === Node.TEXT_NODE) return
        
        // 如果是元素节点
        if (element.nodeType === Node.ELEMENT_NODE) {
          // 如果是段落或div，保留但清除样式
          if (element.tagName.toLowerCase() === 'p' || element.tagName.toLowerCase() === 'div') {
            element.removeAttribute('style')
            element.removeAttribute('class')
          } else if (element.tagName.toLowerCase() === 'a') {
            // 如果是链接，替换为纯文本
            const text = element.textContent
            const textNode = document.createTextNode(text || '')
            element.parentNode?.replaceChild(textNode, element)
            return
          } else if (element.tagName.toLowerCase() !== 'br') {
            // 如果不是换行符，替换为纯文本
            const text = element.textContent
            const textNode = document.createTextNode(text || '')
            element.parentNode?.replaceChild(textNode, element)
            return
          }
          
          // 处理子元素
          const children = Array.from(element.childNodes)
          children.forEach(child => {
            cleanFormatting(child as HTMLElement)
          })
        }
      }
      
      cleanFormatting(tempDiv)
      
      // 清除选区内容并插入处理后的内容
      range.deleteContents()
      
      // 将临时容器的所有子节点插入到选区
      while (tempDiv.firstChild) {
        range.insertNode(tempDiv.firstChild)
        range.collapse(false)
      }
    }
  }
  
  // 更新内容
  content.value = editor.value.innerHTML
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
  content: attr(data-placeholder);
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