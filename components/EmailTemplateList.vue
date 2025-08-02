<template>
  <div class="email-templates w-full h-full flex flex-col">
    <!-- 标题区域 -->
    <div class="p-6 border-b border-white/20 flex justify-between items-center">
      <h2 class="text-xl font-bold text-white/90 flex items-center">
        <svg class="w-6 h-6 mr-3 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        模板库
      </h2>
      <!-- 隐藏按钮区域 -->
      <!-- <div class="flex items-center gap-2">
        <button 
          @click="showAnalytics = true"
          class="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="查看统计分析"
        >
          <i class="fas fa-chart-bar text-blue-500"></i>
        </button>
        <button 
          @click="showExportOptions = true"
          class="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="导出模板"
        >
          <i class="fas fa-download text-blue-500"></i>
        </button>
        <button 
          @click="showCreateModal = true" 
          class="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="创建新模板"
        >
          <i class="fas fa-plus text-blue-500"></i>
        </button>
      </div> -->
    </div>

    <!-- 搜索框 -->
    <div class="p-6 border-b border-white/20">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索模板..."
          class="w-full pl-11 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-white/50 text-white placeholder-white/60 font-medium transition-all duration-200"
        />
        <svg class="w-5 h-5 absolute left-3 top-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="p-6 border-b border-white/20">
      <h3 class="text-sm font-bold text-white/95 mb-3 flex items-center">
        <svg class="w-4 h-4 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
        </svg>
        按分类筛选
      </h3>
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = ''"
          class="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          :class="selectedCategory === '' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' : 'bg-white/20 text-white/90 hover:bg-white/30 hover:text-white backdrop-blur-sm border border-white/20'"
        >
          全部
        </button>
        <button
          v-for="category in allCategories"
          :key="category"
          @click="selectedCategory = category"
          class="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
          :class="selectedCategory === category ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' : 'bg-white/20 text-white/90 hover:bg-white/30 hover:text-white backdrop-blur-sm border border-white/20'"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 模板列表 -->
    <div class="flex-1 p-6 pb-4 space-y-3 overflow-y-auto custom-scrollbar">
      <button
        v-for="template in filteredTemplates"
        :key="template.id"
        @click="selectTemplate(template)"
        class="w-full text-left p-4 rounded-xl transition-all duration-200 group relative backdrop-blur-sm border transform hover:scale-[1.02]"
        :class="[
          selectedId === template.id
            ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-white border-purple-300/50 shadow-lg shadow-purple-500/20'
            : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white/90 hover:text-white hover:shadow-lg'
        ]"
      >
        <!-- 模板名称 -->
        <div class="font-semibold mb-2 text-base">{{ template.name }}</div>
        
        <!-- 模板分类标签 -->
        <div class="mb-2">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-medium"
            :class="selectedId === template.id 
              ? 'bg-purple-400/30 text-purple-100 border border-purple-300/30' 
              : 'bg-white/20 text-white/80 border border-white/20'"
          >
            {{ template.category }}
          </span>
        </div>
        
        <!-- 模板预览 -->
        <div class="text-sm line-clamp-2"
          :class="selectedId === template.id ? 'text-white/80' : 'text-white/70'"
        >
          {{ template.title }}
        </div>

        <!-- 悬浮时显示的操作按钮 -->
        <div 
          class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div 
            class="relative inline-block"
            @mouseenter="(e: MouseEvent) => showPreview(template, e)"
            @mouseleave="startHidePreview"
          >
            <button 
              class="p-1 hover:bg-blue-100 rounded-md"
              title="预览模板"
              @click.stop
            >
              <i class="fas fa-eye text-blue-500"></i>
            </button>

            <!-- 悬浮预览框 -->
            <Teleport to="body">
              <Transition name="fade">
                <div
                  v-if="hoveredTemplate?.id === template.id"
                  class="preview-popup-wrapper"
                  @mouseenter="keepPreview"
                  @mouseleave="startHidePreview"
                  :style="{
                    top: `${previewPosition.top}px`,
                    left: `${previewPosition.left}px`
                  }"
                >
                  <div class="preview-popup">
                    <div class="preview-header">
                      <i class="fas fa-eye text-blue-500 mr-2"></i>
                      {{ template.name }}
                    </div>
                    <div class="preview-body">
                      <div class="mb-3">
                        <div class="text-xs text-gray-500 mb-1">邮件标题</div>
                        <div class="text-sm font-medium text-gray-700">{{ template.title }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-500 mb-1">邮件内容</div>
                        <div
                          class="text-sm preview-content"
                          v-html="sanitizeHTML(template.content)"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>
        </div>
      </button>
    </div>

    <!-- 导出选项模态框 -->
    <div 
      v-if="showExportOptions" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showExportOptions = false"
    >
      <div class="bg-white rounded-lg shadow-lg w-80 overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 class="font-medium text-gray-800">选择导出方式</h3>
          <button 
            @click="showExportOptions = false"
            class="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <i class="fas fa-times text-gray-500"></i>
          </button>
        </div>
        <div class="p-4 space-y-3">
          <button
            @click="exportCurrentTemplate"
            class="w-full text-left p-3 rounded-lg transition-all duration-200 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 flex items-center"
          >
            <i class="fas fa-file-export text-blue-500 mr-3"></i>
            <div>
              <div class="font-medium">导出当前模板</div>
              <div class="text-xs text-gray-500">导出当前选中的模板为HTML文件</div>
            </div>
          </button>
          
          <button
            @click="exportAllTemplates"
            class="w-full text-left p-3 rounded-lg transition-all duration-200 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 flex items-center"
          >
            <i class="fas fa-file-archive text-blue-500 mr-3"></i>
            <div>
              <div class="font-medium">导出所有模板</div>
              <div class="text-xs text-gray-500">将所有模板打包为ZIP文件下载</div>
            </div>
          </button>
          
          <button
            @click="exportFilteredTemplates"
            class="w-full text-left p-3 rounded-lg transition-all duration-200 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 flex items-center"
          >
            <i class="fas fa-filter text-blue-500 mr-3"></i>
            <div>
              <div class="font-medium">导出筛选结果</div>
              <div class="text-xs text-gray-500">导出当前筛选的模板列表为ZIP文件</div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- 分析统计模态框 -->
    <TemplateAnalytics
      :is-open="showAnalytics"
      @close="showAnalytics = false"
    />

    <!-- 创建模板模态框 -->
    <CreateTemplateModal 
      :is-open="showCreateModal" 
      @close="showCreateModal = false" 
      @created="handleTemplateCreated" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { EmailTemplate } from '~/types/email'
import { emailTemplates } from '~/data/emailTemplates'
import CreateTemplateModal from './CreateTemplateModal.vue'
import TemplateAnalytics from './TemplateAnalytics.vue'
import { exportTemplateAsHtml, exportTemplatesAsZip } from '~/utils/exportUtils'

// 使用安全 HTML 处理
const { sanitizeHTML } = useSafeHTML()

// 初始化时不选中任何模板，避免覆盖本地保存的内容
const selectedId = ref<number | null>(null)
const searchQuery = ref('')
const hoveredTemplate = ref<EmailTemplate | null>(null)
const previewPosition = ref({ top: 0, left: 0 })
const selectedCategory = ref('')
const showCreateModal = ref(false)
const showExportOptions = ref(false)
const showAnalytics = ref(false)
let previewTimer: NodeJS.Timeout | null = null
let hidePreviewTimer: NodeJS.Timeout | null = null

// 获取所有分类
const allCategories = computed(() => {
  const categories = [...new Set(emailTemplates.map(template => template.category))]
  return categories
})

// 过滤模板
const filteredTemplates = computed(() => {
  let templates = emailTemplates
  
  // 按分类筛选
  if (selectedCategory.value) {
    templates = templates.filter(template => 
      template.category === selectedCategory.value
    )
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    templates = templates.filter(template => 
      template.name.toLowerCase().includes(query) || 
      template.title.toLowerCase().includes(query)
    )
  }
  
  return templates
})

const emit = defineEmits<{
  (e: 'select', template: EmailTemplate): void
}>()

function selectTemplate(template: EmailTemplate) {
  selectedId.value = template.id
  emit('select', template)
}

function showPreview(template: EmailTemplate, event: MouseEvent) {
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
  
  if (hidePreviewTimer) {
    clearTimeout(hidePreviewTimer)
    hidePreviewTimer = null
  }
  
  // 获取触发元素的位置
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  
  // 计算预览框的位置
  const previewWidth = 480 // 预览框宽度
  const margin = 20 // 边距
  
  // 检查右侧空间是否足够
  const rightSpace = window.innerWidth - rect.right
  const leftSpace = rect.left
  
  let left, top
  
  if (rightSpace >= previewWidth + margin) {
    // 右侧有足够空间
    left = rect.right + margin
  } else if (leftSpace >= previewWidth + margin) {
    // 左侧有足够空间
    left = rect.left - previewWidth - margin
  } else {
    // 两侧都没有足够空间，居中显示并减小宽度
    left = Math.max(margin, (window.innerWidth - previewWidth) / 2)
  }
  
  // 计算垂直位置，确保在视口内
  top = rect.top
  const previewHeight = 300 // 预览框估计高度
  if (top + previewHeight > window.innerHeight) {
    top = Math.max(margin, window.innerHeight - previewHeight - margin)
  }
  
  previewPosition.value = { top, left }
  
  previewTimer = setTimeout(() => {
    hoveredTemplate.value = template
  }, 100)
}

function startHidePreview() {
  if (hidePreviewTimer) {
    clearTimeout(hidePreviewTimer)
  }
  
  hidePreviewTimer = setTimeout(() => {
    hoveredTemplate.value = null
    hidePreviewTimer = null
  }, 200)
}

function keepPreview() {
  if (hidePreviewTimer) {
    clearTimeout(hidePreviewTimer)
    hidePreviewTimer = null
  }
}

function handleTemplateCreated(template: EmailTemplate) {
  // 选中新创建的模板
  selectedId.value = template.id
  emit('select', template)
  
  // 显示成功提示
  alert('模板创建成功！')
}

// 导出当前选中的模板
function exportCurrentTemplate() {
  const template = emailTemplates.find(t => t.id === selectedId.value)
  if (template) {
    exportTemplateAsHtml(template)
    showExportOptions.value = false
  } else {
    alert('请先选择一个模板')
  }
}

// 导出所有模板
async function exportAllTemplates() {
  await exportTemplatesAsZip(emailTemplates)
  showExportOptions.value = false
}

// 导出筛选后的模板
async function exportFilteredTemplates() {
  if (filteredTemplates.value.length === 0) {
    alert('当前没有符合筛选条件的模板')
    return
  }
  
  await exportTemplatesAsZip(filteredTemplates.value)
  showExportOptions.value = false
}

// 在组件挂载时检查是否需要自动选中模板
onMounted(() => {
  // 确保在客户端环境下执行
  if (import.meta.client && emailTemplates.length > 0) {
    // 检查是否有任何本地保存的内容
    let hasAnyLocalContent = false
    
    try {
      const storedData = localStorage.getItem('email_editor_draft')
      if (storedData) {
        const parsed = JSON.parse(storedData)
        // 检查新格式或旧格式
        if ((parsed.version && parsed.drafts && Object.keys(parsed.drafts).length > 0) || 
            (parsed.title !== undefined)) {
          hasAnyLocalContent = true
        }
      }
    } catch (e) {
      // 忽略解析错误
    }
    
    if (!hasAnyLocalContent) {
      // 只有在没有任何本地保存内容时，才自动选中第一个模板
      nextTick(() => {
        emit('select', emailTemplates[0])
      })
    }
  }
})
</script>

<style scoped>
.email-templates {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
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

/* 确保 line-clamp 在所有浏览器中工作 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-popup-wrapper {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
}

.preview-popup {
  width: 480px;
  max-height: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.preview-header {
  background-color: #f8fafc;
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
}

.preview-body {
  padding: 16px;
  max-height: 340px;
  overflow-y: auto;
}

.preview-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background-color: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 