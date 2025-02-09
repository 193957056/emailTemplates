<template>
  <div class="email-editor p-6 max-w-4xl mx-auto">
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
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        <i class="fas fa-pen-to-square mr-2 text-blue-500"></i>
        邮件内容
      </label>
      <div class="border border-gray-200 rounded-lg shadow-sm bg-white">
        <!-- 工具栏 -->
        <div class="border-b border-gray-200 p-2 flex gap-2 bg-gray-50 rounded-t-lg">
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
          <div class="flex items-center gap-1 px-2">
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
        </div>
        
        <!-- 内容区域 -->
        <div
          ref="editor"
          contenteditable="true"
          class="p-6 min-h-[400px] max-h-[600px] overflow-y-auto focus:outline-none text-gray-700 leading-relaxed"
          @input="updateContent"
          placeholder="请输入邮件内容..."
        ></div>
      </div>
    </div>

    <!-- 底部工具栏 -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500">
        <i class="fas fa-info-circle mr-1"></i>
        支持富文本编辑
      </div>
      <button
        @click="copyContent"
        class="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2 shadow-sm"
      >
        <i class="fas fa-copy"></i>
        {{ copyStatus }}
      </button>
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
const copyStatus = ref('复制内容')

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

// 复制内容
async function copyContent() {
  if (!editor.value) return

  // 创建一个更适合邮件显示的 HTML 内容
  const styledHtmlContent = `
    <div style="
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
    ">
      <div style="
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      ">
        <strong style="color: #2563eb;">标题：</strong>
        <span style="margin-left: 8px;">${title.value}</span>
      </div>
      <div>
        <strong style="color: #2563eb;">内容：</strong>
        <div style="
          margin-top: 8px;
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 4px;
        ">
          ${editor.value.innerHTML}
        </div>
      </div>
    </div>
  `.trim()
  
  const plainText = `标题：${title.value}\n内容：${editor.value.innerText}`

  try {
    if (window.navigator.clipboard.write) {
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
        'text/html': new Blob([styledHtmlContent], { type: 'text/html' })
      })
      await navigator.clipboard.write([clipboardItem])
    } else {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = styledHtmlContent
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
    
    copyStatus.value = '复制成功！'
    setTimeout(() => {
      copyStatus.value = '复制内容'
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    copyStatus.value = '复制失败'
    setTimeout(() => {
      copyStatus.value = '复制内容'
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

// 暴露方法给父组件
defineExpose({
  applyTemplate
})
</script>

<style scoped>
.email-editor {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
  cursor: text;
}

[contenteditable]:focus:before {
  content: '';
}

/* 自定义滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
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
</style> 