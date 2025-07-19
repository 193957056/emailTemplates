<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="close">
        <div class="modal-content" @click.stop>
          <!-- 模态框头部 -->
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-language text-blue-500 mr-2"></i>
              模板语言翻译
            </h3>
            <button class="modal-close" @click="close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- 模态框内容 -->
          <div class="modal-body">
            <!-- 原始语言检测 -->
            <div class="mb-6">
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium text-gray-700">源语言</label>
                <div 
                  v-if="isAutoDetecting" 
                  class="text-xs text-blue-500 flex items-center"
                >
                  <i class="fas fa-spinner fa-spin mr-1"></i>
                  正在检测语言...
                </div>
              </div>
              <div class="flex gap-2">
                <select 
                  v-model="sourceLanguage"
                  class="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  :disabled="isAutoDetecting"
                >
                  <option value="">自动检测</option>
                  <option 
                    v-for="lang in languages" 
                    :key="lang.code" 
                    :value="lang.code"
                  >
                    {{ lang.nativeName }} ({{ lang.name }})
                  </option>
                </select>
                <button 
                  class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  @click="detectLanguage"
                  :disabled="isAutoDetecting || !template"
                >
                  <i class="fas fa-magic mr-1"></i>
                  检测
                </button>
              </div>
            </div>
            
            <!-- 目标语言选择 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">目标语言</label>
              <select 
                v-model="targetLanguage"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option 
                  v-for="lang in languages" 
                  :key="lang.code" 
                  :value="lang.code"
                  :disabled="lang.code === sourceLanguage"
                >
                  {{ lang.nativeName }} ({{ lang.name }})
                </option>
              </select>
            </div>
            
            <!-- 翻译选项 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">翻译选项</label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input 
                    id="translate-title" 
                    type="checkbox" 
                    v-model="translateOptions.title"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="translate-title" class="ml-2 text-sm text-gray-700">翻译标题</label>
                </div>
                <div class="flex items-center">
                  <input 
                    id="translate-content" 
                    type="checkbox" 
                    v-model="translateOptions.content"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="translate-content" class="ml-2 text-sm text-gray-700">翻译内容</label>
                </div>
                <div class="flex items-center">
                  <input 
                    id="preserve-original" 
                    type="checkbox" 
                    v-model="translateOptions.preserveOriginal"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="preserve-original" class="ml-2 text-sm text-gray-700">保留原始模板</label>
                </div>
              </div>
            </div>
            
            <!-- 预览部分 -->
            <div class="border rounded-lg overflow-hidden mb-6" v-if="translatedTemplate">
              <div class="bg-gray-50 p-3 border-b">
                <h4 class="font-medium text-gray-700">
                  翻译预览 - {{ getLanguageName(targetLanguage) }}
                </h4>
              </div>
              <div class="p-4">
                <div class="mb-2">
                  <div class="text-xs text-gray-500 mb-1">标题</div>
                  <div class="font-medium">{{ translatedTemplate.title }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">内容预览 (部分)</div>
                  <div class="text-sm line-clamp-3">
                    {{ stripHtml(translatedTemplate.content).substring(0, 150) }}...
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 状态提示 -->
            <div v-if="translateStatus" :class="[
              'p-3 rounded-lg mb-6 text-sm',
              translateStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            ]">
              <div class="flex items-center">
                <i 
                  :class="[
                    'mr-2',
                    translateStatus.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle'
                  ]"
                ></i>
                <span>{{ translateStatus.message }}</span>
              </div>
            </div>
          </div>

          <!-- 模态框底部 -->
          <div class="modal-footer">
            <div class="flex-1 text-xs text-gray-500" v-if="translatedTemplate">
              <i class="fas fa-info-circle mr-1"></i>
              翻译后的模板将会自动保存
            </div>
            <div class="flex items-center gap-3">
              <button 
                class="btn-outline"
                @click="close"
              >
                取消
              </button>
              <button 
                class="btn-primary"
                @click="translateTemplate"
                :disabled="isTranslating || !canTranslate"
              >
                <i 
                  :class="[
                    'mr-1',
                    isTranslating ? 'fas fa-spinner fa-spin' : 'fas fa-language'
                  ]"
                ></i>
                {{ isTranslating ? '翻译中...' : '翻译' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EmailTemplate } from '~/types/email'
import { supportedLanguages, getLanguageName, detectLanguage as detectLang } from '~/utils/languages'

const props = defineProps<{
  modelValue: boolean
  template?: EmailTemplate
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'translated', value: EmailTemplate): void
}>()

// 语言列表
const languages = supportedLanguages

// 源语言和目标语言
const sourceLanguage = ref('')
const targetLanguage = ref('en')

// 翻译选项
const translateOptions = ref({
  title: true,
  content: true,
  preserveOriginal: true
})

// 状态跟踪
const isAutoDetecting = ref(false)
const isTranslating = ref(false)
const translateStatus = ref<{ type: 'error' | 'info', message: string } | null>(null)
const translatedTemplate = ref<EmailTemplate | null>(null)

// 计算是否可以翻译
const canTranslate = computed(() => {
  return (
    !!props.template &&
    !!targetLanguage.value &&
    (sourceLanguage.value !== targetLanguage.value) &&
    (translateOptions.value.title || translateOptions.value.content)
  )
})

// 监听模板变化，重新检测语言
watch(() => props.template, (newTemplate) => {
  if (newTemplate) {
    sourceLanguage.value = ''
    translatedTemplate.value = null
    translateStatus.value = null
    detectLanguage()
  }
})

// 关闭模态框
function close() {
  emit('update:modelValue', false)
  
  // 如果有翻译结果并且用户选择保存，则发出事件
  if (translatedTemplate.value) {
    emit('translated', translatedTemplate.value)
  }
}

// 检测源语言
async function detectLanguage() {
  if (!props.template) return
  
  isAutoDetecting.value = true
  translateStatus.value = null
  
  try {
    // 组合标题和内容进行检测
    const textToDetect = props.template.title + ' ' + stripHtml(props.template.content)
    
    // 使用工具函数检测语言
    const detectedLanguage = detectLang(textToDetect)
    
    // 设置检测到的语言
    sourceLanguage.value = detectedLanguage
    
    // 如果目标语言和源语言相同，自动切换到其他语言
    if (targetLanguage.value === detectedLanguage) {
      targetLanguage.value = detectedLanguage === 'en' ? 'zh-CN' : 'en'
    }
    
    translateStatus.value = {
      type: 'info',
      message: `检测到源语言为 ${getLanguageName(detectedLanguage)}`
    }
  } catch (error) {
    console.error('语言检测失败', error)
    translateStatus.value = {
      type: 'error',
      message: '语言检测失败，请手动选择源语言'
    }
  } finally {
    isAutoDetecting.value = false
  }
}

// 翻译模板
async function translateTemplate() {
  if (!props.template || !canTranslate.value) return
  
  isTranslating.value = true
  translateStatus.value = null
  
  try {
    // 创建新模板对象
    const newTemplate: EmailTemplate = {
      ...props.template,
      id: translateOptions.value.preserveOriginal ? Date.now() : props.template.id,
      name: translateOptions.value.preserveOriginal 
        ? `${props.template.name} (${getLanguageName(targetLanguage.value)})` 
        : props.template.name,
      language: targetLanguage.value
    }
    
    // 模拟翻译处理 (在实际应用中，这里应该调用翻译API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 翻译标题
    if (translateOptions.value.title) {
      newTemplate.title = await mockTranslation(props.template.title, targetLanguage.value)
    }
    
    // 翻译内容
    if (translateOptions.value.content) {
      newTemplate.content = await mockTranslateHtml(props.template.content, targetLanguage.value)
    }
    
    // 设置翻译结果
    translatedTemplate.value = newTemplate
    
    translateStatus.value = {
      type: 'info',
      message: `翻译完成，模板已转换为 ${getLanguageName(targetLanguage.value)}`
    }
  } catch (error) {
    console.error('翻译失败', error)
    translateStatus.value = {
      type: 'error',
      message: '翻译失败，请稍后重试'
    }
  } finally {
    isTranslating.value = false
  }
}

// 从HTML中提取纯文本
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

// 模拟翻译函数 (生产环境中应使用实际的翻译API)
async function mockTranslation(text: string, targetLang: string): Promise<string> {
  // 这里只是简单模拟翻译结果
  // 在真实场景中，您应该使用谷歌翻译API、DeepL或其他翻译服务
  
  // 简单的示例翻译映射
  const translations: Record<string, Record<string, string>> = {
    'zh-CN': {
      'Email Template': '邮件模板',
      'Welcome': '欢迎',
      'Newsletter': '新闻通讯',
      'Thank you': '谢谢你',
      'Confirmation': '确认',
      'Invitation': '邀请函',
      'Notification': '通知',
      'Alert': '提醒',
      'Update': '更新',
      'Announcement': '公告',
    },
    'en': {
      '邮件模板': 'Email Template',
      '欢迎': 'Welcome',
      '新闻通讯': 'Newsletter',
      '谢谢你': 'Thank you',
      '确认': 'Confirmation',
      '邀请函': 'Invitation',
      '通知': 'Notification',
      '提醒': 'Alert',
      '更新': 'Update',
      '公告': 'Announcement',
    },
    'ja': {
      'Email Template': 'メールテンプレート',
      'Welcome': 'ようこそ',
      'Newsletter': 'ニュースレター',
      'Thank you': 'ありがとうございます',
      'Confirmation': '確認',
      'Invitation': '招待状',
      'Notification': '通知',
      'Alert': 'アラート',
      'Update': '更新',
      'Announcement': 'お知らせ',
    }
  }
  
  // 获取目标语言的翻译映射
  const langMap = translations[targetLang] || {}
  
  // 查找映射中是否有对应翻译
  for (const [source, target] of Object.entries(langMap)) {
    if (text.includes(source)) {
      text = text.replace(new RegExp(source, 'g'), target)
    }
  }
  
  // 如果没有翻译，添加标记
  if (Object.keys(langMap).length === 0) {
    text = `[${targetLang}] ${text}`
  }
  
  return text
}

// 模拟HTML内容翻译
async function mockTranslateHtml(html: string, targetLang: string): Promise<string> {
  // 创建DOM解析器
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // 递归处理文本节点
  async function processNode(node: Node): Promise<void> {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      // 翻译文本节点
      if (node.textContent) {
        node.textContent = await mockTranslation(node.textContent, targetLang)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // 处理元素节点的属性
      const element = node as Element
      
      // 处理alt和title属性
      if (element.hasAttribute('alt')) {
        const alt = element.getAttribute('alt')
        if (alt) {
          element.setAttribute('alt', await mockTranslation(alt, targetLang))
        }
      }
      
      if (element.hasAttribute('title')) {
        const title = element.getAttribute('title')
        if (title) {
          element.setAttribute('title', await mockTranslation(title, targetLang))
        }
      }
      
      // 递归处理子节点
      for (const child of Array.from(node.childNodes)) {
        await processNode(child)
      }
    }
  }
  
  // 处理文档体
  await processNode(doc.body)
  
  // 如果是阿拉伯语等RTL语言，添加方向属性
  if (['ar', 'he', 'fa', 'ur'].includes(targetLang)) {
    doc.body.setAttribute('dir', 'rtl')
    
    // 查找所有段落，添加RTL文本对齐
    const paragraphs = doc.querySelectorAll('p, div, td, th, h1, h2, h3, h4, h5, h6')
    paragraphs.forEach(p => {
      ;(p as HTMLElement).style.textAlign = 'right'
    })
  }
  
  // 将处理后的HTML返回
  return doc.body.innerHTML
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  padding: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-outline {
  border: 1px solid #d1d5db;
  color: #4b5563;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style> 