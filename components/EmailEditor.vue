<template>
  <div class="email-editor h-full flex flex-col">
    <!-- 标题输入 -->
    <div class="p-6 border-b border-white/20">
      <label class="block text-sm font-bold text-white/90 mb-3 flex items-center">
        <svg class="w-5 h-5 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        邮件标题
      </label>
      <input
        v-model="title"
        type="text"
        class="input-field text-gray-800 placeholder-gray-500 bg-white/90 border-2 border-white/40 shadow-lg"
        placeholder="请输入一个吸引人的邮件标题..."
        @input="handleTitleChange"
        :aria-describedby="validationErrors.title ? 'title-error' : undefined"
      />
      <p v-if="validationErrors.title" id="title-error" class="text-red-400 text-sm mt-2 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        {{ validationErrors.title }}
      </p>
    </div>

    <!-- 内容编辑器 -->
    <div class="flex-1 flex flex-col">
      <label class="block text-sm font-bold text-white/90 mb-3 px-6 pt-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
        邮件内容
      </label>

      <div class="flex-1 flex flex-col mx-6 mb-6 glass-ultra rounded-2xl overflow-hidden">
        <!-- 富文本工具栏 -->
        <RichTextToolbar
          :current-color="currentColor"
          :current-bg-color="currentBgColor"
          @execute-command="executeCommand"
          @apply-heading="applyHeading"
          @apply-font-size="applyFontSize"
          @set-text-color="setTextColor"
          @set-background-color="setBackgroundColor"
          @insert-horizontal-rule="insertHorizontalRule"
          @clear-formatting="clearFormatting"
          @show-link-dialog="showLinkDialog = true"
          @show-table-dialog="showTableDialog = true"
        />

        <!-- 编辑器内容区域 -->
        <div class="flex-1 p-4 relative">
          <div
            ref="editorElement"
            contenteditable="true"
            class="editor-area w-full p-6 outline-none overflow-auto min-h-[300px] text-gray-800 custom-scrollbar rounded-xl relative z-10"
            @input="handleContentChange"
            @paste="handlePaste"
            @keydown="handleKeydown"
            v-html="sanitizedContent"
            role="textbox"
            aria-multiline="true"
            :aria-describedby="validationErrors.content ? 'content-error' : undefined"
            placeholder="开始编写你的邮件内容..."
          ></div>
          
          <!-- 占位符文本 -->
          <div 
            v-if="!content" 
            class="placeholder absolute top-10 left-10 pointer-events-none text-gray-500 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            <span>开始编写你的邮件内容...</span>
          </div>
        </div>

        <p v-if="validationErrors.content" id="content-error" class="text-red-500 text-sm mx-4 mb-2">
          {{ validationErrors.content }}
        </p>

        <!-- 编辑器帮助文本 -->
        <div id="editor-help" class="sr-only">
          使用富文本编辑器编写邮件内容。支持键盘快捷键：Ctrl+B 加粗，Ctrl+I 斜体，Ctrl+U 下划线，Ctrl+S 保存。按 F1 查看完整快捷键列表。
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <!-- 自动保存状态 -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <i class="fas fa-save" :class="{ 'text-green-500': autoSaveStatus === 'saved' }"></i>
          <span>{{ autoSaveStatusText }}</span>
        </div>

        <!-- 字数统计 -->
        <div class="text-sm text-gray-500">
          字数: {{ wordCount }}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- 保存按钮 -->
        <button
          @click="handleSave"
          class="btn-secondary flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          保存草稿
        </button>
      </div>
    </div>

    <!-- 链接对话框 -->
    <LinkDialog
      v-model="showLinkDialog"
      @insert-link="insertLink"
    />

    <!-- 表格对话框 -->
    <TableDialog
      v-model="showTableDialog"
      @insert-table="insertTable"
    />

    <!-- 保存成功提示 -->
    <Transition name="fade">
      <div
        v-if="showSaveSuccess"
        class="fixed top-6 right-6 z-50 glass-ultra rounded-2xl p-4 flex items-center space-x-3 animate-bounce-subtle"
      >
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <p class="text-white font-semibold">保存成功</p>
          <p class="text-white/80 text-sm">草稿已自动保存到本地</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { EmailTemplate, EmailValidationErrors } from '~/types/email'
import RichTextToolbar from './editor/RichTextToolbar.vue'
import LinkDialog from './editor/LinkDialog.vue'
import TableDialog from './editor/TableDialog.vue'

// Composables
const { sanitizeHTML } = useSafeHTML()
const { validateTemplate } = useValidation()
const {
  saveToLocalStorage: saveToStorage,
  loadFromLocalStorage,
  hasLocalStorage,
  cleanupExpiredStorage
} = useLocalStorage()
const {
  editorRef,
  currentColor,
  currentBgColor,
  executeCommand,
  applyHeading,
  applyFontSize,
  setTextColor,
  setBackgroundColor,
  insertLink,
  insertTable,
  insertHorizontalRule,
  clearFormatting,
  getContent,
  setContent,
  focusEditor,
  setEditorRef
} = useRichTextEditor()
const {
  announce,
  setAriaAttributes,
  handleKeyboardNavigation,
  createFocusTrap
} = useAccessibility()
const {
  registerShortcut,
  initDefaultShortcuts
} = useKeyboardShortcuts()

// 响应式数据
const title = ref('')
const content = ref('')
const editorElement = ref<HTMLElement | null>(null)
const showLinkDialog = ref(false)
const showTableDialog = ref(false)
const showSaveSuccess = ref(false)
const autoSaveStatus = ref<'saving' | 'saved' | 'error'>('saved')
const validationErrors = ref<EmailValidationErrors>({})

// 计算属性
const sanitizedContent = computed(() => sanitizeHTML(content.value))
const wordCount = computed(() => {
  const text = content.value.replace(/<[^>]*>/g, '')
  return text.trim().length
})

const autoSaveStatusText = computed(() => {
  switch (autoSaveStatus.value) {
    case 'saving': return '保存中...'
    case 'saved': return '已保存'
    case 'error': return '保存失败'
    default: return ''
  }
})

// 方法
const handleTitleChange = () => {
  validateForm()
  autoSave()
}

const handleContentChange = () => {
  if (editorElement.value) {
    content.value = editorElement.value.innerHTML
    validateForm()
    autoSave()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain') || ''
  const sanitizedText = sanitizeHTML(text)
  executeCommand('insertHTML', sanitizedText)
}

const handleKeydown = (event: KeyboardEvent) => {
  // 处理可访问性键盘导航
  handleKeyboardNavigation(event)

  // 处理编辑器特定的键盘事件
  const { key, ctrlKey, metaKey, altKey } = event

  // 快捷键已由 useKeyboardShortcuts 处理，这里处理编辑器特定的导航
  if (!ctrlKey && !metaKey && !altKey) {
    switch (key) {
      case 'Tab':
        // 在编辑器内部，Tab 应该插入制表符或缩进
        if (event.target === editorElement.value) {
          event.preventDefault()
          executeCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
          announce('已插入缩进', 'polite')
        }
        break

      case 'Enter':
        // 宣布新行
        if (event.target === editorElement.value) {
          setTimeout(() => {
            announce('新行', 'polite')
          }, 100)
        }
        break

      case 'Backspace':
      case 'Delete':
        // 宣布删除操作
        setTimeout(() => {
          const content = getContent()
          if (!content.trim()) {
            announce('内容已清空', 'polite')
          }
        }, 100)
        break
    }
  }

  // 处理 Escape 键
  if (key === 'Escape') {
    if (showLinkDialog.value) {
      showLinkDialog.value = false
      announce('已关闭链接对话框', 'polite')
    } else if (showTableDialog.value) {
      showTableDialog.value = false
      announce('已关闭表格对话框', 'polite')
    }
  }
}

const validateForm = () => {
  const result = validateTemplate({
    title: title.value,
    content: content.value,
    name: 'temp',
    category: 'work'
  })
  validationErrors.value = result.errors
}

const autoSave = () => {
  if (title.value || content.value) {
    autoSaveStatus.value = 'saving'
    try {
      saveToStorage(title.value, content.value)
      autoSaveStatus.value = 'saved'
    } catch (error) {
      console.error('自动保存失败:', error)
      autoSaveStatus.value = 'error'
    }
  }
}

const saveToLocalStorage = () => {
  try {
    saveToStorage(title.value, content.value)
    autoSaveStatus.value = 'saved'
    console.log('手动保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    autoSaveStatus.value = 'error'
  }
}

const handleSave = () => {
  try {
    saveToStorage(title.value, content.value)
    autoSaveStatus.value = 'saved'
    
    // 显示保存成功提示
    showSaveSuccess.value = true
    
    // 2秒后自动隐藏提示
    setTimeout(() => {
      showSaveSuccess.value = false
    }, 2000)
    
    console.log('手动保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    autoSaveStatus.value = 'error'
  }
}

const loadSavedContent = () => {
  const savedData = loadFromLocalStorage()
  if (savedData) {
    title.value = savedData.title
    content.value = savedData.content
    nextTick(() => {
      if (editorElement.value) {
        editorElement.value.innerHTML = content.value
      }
    })
  }
}

// 生命周期
onMounted(() => {
  // 设置编辑器引用
  setEditorRef(editorElement.value)

  // 清理过期存储
  cleanupExpiredStorage()

  // 加载保存的内容
  if (hasLocalStorage()) {
    loadSavedContent()
  }

  // 初始化快捷键
  initDefaultShortcuts({
    save: saveToLocalStorage,
    undo: () => executeCommand('undo'),
    redo: () => executeCommand('redo'),
    bold: () => executeCommand('bold'),
    italic: () => executeCommand('italic'),
    underline: () => executeCommand('underline'),
    copy: () => {
      if (import.meta.client) {
        navigator.clipboard.writeText(getContent())
        announce('内容已复制到剪贴板', 'polite')
      }
    }
  })

  // 设置可访问性属性
  if (editorElement.value) {
    setAriaAttributes(editorElement.value, {
      'aria-label': '邮件内容编辑器',
      'aria-describedby': 'editor-help',
      'aria-multiline': 'true',
      'role': 'textbox'
    })
  }

  // 聚焦编辑器
  nextTick(() => {
    focusEditor()
    announce('邮件编辑器已准备就绪', 'polite')
  })
})

// 监听编辑器元素变化
watch(editorElement, (newElement) => {
  setEditorRef(newElement)
})

// 应用模板的方法
const applyTemplate = (template: EmailTemplate) => {
  title.value = template.title
  content.value = template.content
  
  // 更新编辑器内容
  nextTick(() => {
    if (editorElement.value) {
      editorElement.value.innerHTML = template.content
    }
    // 触发验证
    validateForm()
    // 自动保存
    autoSave()
    // 宣布模板已应用
    announce(`已应用模板：${template.name}`, 'polite')
  })
}

// 暴露方法给父组件
defineExpose({
  getTitle: () => title.value,
  getContent: () => content.value,
  setTitle: (newTitle: string) => { title.value = newTitle },
  setContent: (newContent: string) => {
    content.value = newContent
    if (editorElement.value) {
      editorElement.value.innerHTML = newContent
    }
  },
  applyTemplate,
  focus: focusEditor,
  validate: validateForm,
  save: saveToLocalStorage
})
</script>

<style scoped>
.email-editor {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.email-content {
  line-height: 1.6;
}

.email-content h1, .email-content h2, .email-content h3, .email-content h4 {
  margin: 1em 0 0.5em 0;
  font-weight: bold;
}

.email-content p {
  margin: 0.5em 0;
}

.email-content ul, .email-content ol {
  margin: 0.5em 0;
  padding-left: 2em;
}

.email-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.email-content table td, .email-content table th {
  border: 1px solid #ddd;
  padding: 8px;
}

.email-content table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
</style>