<template>
  <div class="min-h-screen relative">
    <!-- 顶部导航栏 -->
    <nav class="glass-ultra border-0 border-b border-white/20 shadow-xl">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center">
            <!-- 移动端菜单按钮 -->
            <button
              @click="toggleTemplateList"
              class="lg:hidden mr-4 p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-300"
              aria-label="切换模板列表"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
              </svg>
            </button>

            <h1 class="text-2xl font-bold text-white flex items-center">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center mr-4 backdrop-blur animate-float shadow-2xl">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <span class="hidden sm:inline bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent font-extrabold tracking-wide">邮件模板编辑器</span>
              <span class="sm:hidden bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent font-extrabold">编辑器</span>
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <!-- 响应式预览按钮 -->
            <button
              @click="showResponsivePreview"
              class="hidden md:flex items-center px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 animate-glow"
              title="响应式预览"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span class="hidden lg:inline font-medium">预览</span>
            </button>

            <div class="flex items-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur text-white/90">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">{{ currentTime }}</span>
              <span class="sm:hidden text-sm font-medium">{{ shortTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="flex flex-col lg:flex-row h-[calc(100vh-80px)] p-6 gap-6">
      <!-- 模板列表 - 响应式侧边栏 -->
      <div
        class="w-full lg:w-80 glass-ultra rounded-2xl transition-all duration-500 hover:scale-[1.02]"
        :class="{
          'hidden lg:block': !showTemplateListMobile,
          'fixed inset-4 z-40 lg:relative lg:inset-auto': showTemplateListMobile,
          'lg:static': !showTemplateListMobile
        }"
      >
        <!-- 移动端遮罩层 -->
        <div
          v-if="showTemplateListMobile && isMobile"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          @click="closeTemplateList"
        ></div>

        <!-- 模板列表内容 -->
        <div class="relative z-40 h-full lg:z-auto rounded-2xl overflow-hidden">
          <!-- 移动端关闭按钮 -->
          <div class="lg:hidden flex justify-between items-center p-6 border-b border-white/20">
            <h2 class="text-xl font-bold text-white">模板列表</h2>
            <button
              @click="closeTemplateList"
              class="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="关闭模板列表"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <ClientOnly>
            <EmailTemplateList
              @select="handleTemplateSelect"
              :is-mobile="isMobile"
              :show-mobile="showTemplateListMobile"
            />
          </ClientOnly>
        </div>
      </div>

      <!-- 编辑器区域 -->
      <div class="flex-1 overflow-hidden glass-ultra rounded-2xl transition-all duration-500 hover:scale-[1.01]">
        <ClientOnly>
          <EmailEditor ref="emailEditor" />
        </ClientOnly>
      </div>
    </div>

    <!-- 响应式预览模态框 -->
    <ClientOnly>
      <ResponsivePreviewModal
        v-if="showResponsiveModal"
        :template="currentTemplate"
        @close="showResponsiveModal = false"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { EmailTemplate } from '~/types/email'

// 响应式数据
const emailEditor = ref<{
  applyTemplate: (template: EmailTemplate) => void
  getTitle: () => string
  getContent: () => string
} | null>(null)

const showTemplateListMobile = ref(false)
const showResponsiveModal = ref(false)
const currentTemplate = ref<EmailTemplate | null>(null)
const windowWidth = ref(0)

// 计算属性
const isMobile = computed(() => windowWidth.value < 1024)

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const shortTime = computed(() => {
  const now = new Date()
  return now.toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 方法
function handleTemplateSelect(template: EmailTemplate) {
  currentTemplate.value = template

  // 确保在客户端环境下执行
  if (import.meta.client) {
    // 使用 nextTick 确保组件已挂载
    nextTick(() => {
      emailEditor.value?.applyTemplate(template)
    })
  }

  // 移动端选择模板后关闭列表
  if (isMobile.value) {
    closeTemplateList()
  }
}

function toggleTemplateList() {
  showTemplateListMobile.value = !showTemplateListMobile.value
}

function closeTemplateList() {
  showTemplateListMobile.value = false
}

function showResponsivePreview() {
  if (emailEditor.value && currentTemplate.value) {
    // 获取当前编辑器内容
    const currentContent = {
      ...currentTemplate.value,
      title: emailEditor.value.getTitle(),
      content: emailEditor.value.getContent()
    }
    currentTemplate.value = currentContent
    showResponsiveModal.value = true
  }
}

function updateWindowWidth() {
  windowWidth.value = window.innerWidth
}

function handleResize() {
  updateWindowWidth()

  // 桌面端自动关闭移动端菜单
  if (!isMobile.value) {
    showTemplateListMobile.value = false
  }
}

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (showResponsiveModal.value) {
      showResponsiveModal.value = false
    } else if (showTemplateListMobile.value) {
      closeTemplateList()
    }
  }
}

// 生命周期
onMounted(() => {
  if (import.meta.client) {
    updateWindowWidth()
    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleEscapeKey)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('keydown', handleEscapeKey)
  }
})
</script>

<style>
html, body {
  height: 100%;
}

/* 响应式设计样式 */
@media (max-width: 1023px) {
  .mobile-menu-open {
    overflow: hidden;
  }
}

/* 平滑过渡动画 */
.template-list-enter-active,
.template-list-leave-active {
  transition: transform 0.3s ease-in-out;
}

.template-list-enter-from {
  transform: translateX(-100%);
}

.template-list-leave-to {
  transform: translateX(-100%);
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* 确保移动端菜单在正确的层级 */
@media (max-width: 1023px) {
  .mobile-template-list {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
  }
}

/* 工具提示样式 */
.tooltip {
  position: relative;
}

.tooltip:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
}
</style>
