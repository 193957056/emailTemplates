<template>
  <div class="email-templates w-72 bg-white border-r border-gray-200 min-h-[calc(100vh-88px)]">
    <!-- 标题区域 -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <h2 class="text-lg font-semibold text-gray-700 flex items-center">
        <i class="fas fa-envelope-open-text mr-2 text-blue-500"></i>
        邮件模板
      </h2>
    </div>

    <!-- 搜索框 -->
    <div class="p-4 border-b border-gray-200">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索模板..."
          class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
      </div>
    </div>

    <!-- 模板列表 -->
    <div class="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-230px)]">
      <button
        v-for="template in filteredTemplates"
        :key="template.id"
        @click="selectTemplate(template)"
        class="w-full text-left p-3 rounded-lg transition-all duration-200 hover:shadow-md group relative"
        :class="[
          selectedId === template.id
            ? 'bg-blue-50 text-blue-600 border-blue-200 border'
            : 'bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200'
        ]"
      >
        <!-- 模板名称 -->
        <div class="font-medium mb-1">{{ template.name }}</div>
        
        <!-- 模板预览 -->
        <div class="text-xs text-gray-500 line-clamp-2">
          {{ template.title }}
        </div>

        <!-- 悬浮时显示的操作按钮 -->
        <div 
          class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div 
            class="relative inline-block"
            @mouseenter="(e: MouseEvent) => showPreview(template, e)"
            @mouseleave="hidePreview"
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
                  @mouseleave="hidePreview"
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
                          v-html="template.content"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { EmailTemplate } from '~/types/email'
import { emailTemplates } from '~/data/emailTemplates'

// 将 selectedId 的初始值设置为第一个模板的 id
const selectedId = ref(emailTemplates[0]?.id || null)
const searchQuery = ref('')
const hoveredTemplate = ref<EmailTemplate | null>(null)
const previewPosition = ref({ top: 0, left: 0 })
let previewTimer: NodeJS.Timeout | null = null

// 过滤模板
const filteredTemplates = computed(() => {
  if (!searchQuery.value) return emailTemplates
  const query = searchQuery.value.toLowerCase()
  return emailTemplates.filter(template => 
    template.name.toLowerCase().includes(query) || 
    template.title.toLowerCase().includes(query)
  )
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

function hidePreview() {
  if (previewTimer) {
    clearTimeout(previewTimer)
    previewTimer = null
  }
  setTimeout(() => {
    hoveredTemplate.value = null
  }, 100)
}

function keepPreview() {
  if (previewTimer) {
    clearTimeout(previewTimer)
    previewTimer = null
  }
}

// 在组件挂载时自动选中第一个模板
onMounted(() => {
  // 确保在客户端环境下执行
  if (process.client && emailTemplates.length > 0) {
    // 使用 nextTick 确保 DOM 已更新
    nextTick(() => {
      selectTemplate(emailTemplates[0])
    })
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.preview-popup-wrapper {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  transform: translateY(-50%); /* 垂直居中对齐 */
}

.preview-popup {
  pointer-events: auto;
  width: 480px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  position: relative;
}

/* 添加箭头 */
.preview-popup::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  width: 12px;
  height: 12px;
  background: white;
  border-left: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  transform: translateY(-50%) rotate(45deg);
}

/* 调整动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-50%) translateX(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-10px);
}

.preview-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #1f2937;
  background-color: #f9fafb;
  border-radius: 8px 8px 0 0;
  font-size: 0.875rem;
}

.preview-body {
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

.preview-content {
  padding: 1.25rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.6;
}

.preview-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.preview-content :deep(p:last-child) {
  margin-bottom: 0;
}

.preview-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.preview-content :deep(li) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.preview-content :deep(li:last-child) {
  margin-bottom: 0;
}

.preview-content :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}
</style> 