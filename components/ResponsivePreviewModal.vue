<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click="close">
        <div class="glass-ultra rounded-2xl w-full max-w-6xl max-h-[90vh] mx-4 overflow-hidden" @click.stop>
          <!-- 模态框头部 -->
          <div class="flex items-center justify-between p-6 border-b border-white/20">
            <h3 class="text-xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 mr-3 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              响应式预览
            </h3>
            
            <!-- 设备选择按钮 -->
            <div class="flex items-center space-x-2">
              <button 
                v-for="device in devices" 
                :key="device.type"
                @click="currentDevice = device.type"
                class="p-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                :class="currentDevice === device.type 
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-300/50' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'"
                :title="device.label"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="device.icon"></path>
                </svg>
              </button>
              
              <button class="p-3 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200 border border-white/20" @click="close">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- 模态框内容 -->
          <div class="p-6">
            <div class="flex justify-center">
              <!-- 设备框架 -->
              <div class="transition-all duration-300" :class="deviceFrameClass">
                <!-- 设备状态栏 (仅移动端) -->
                <div v-if="currentDevice === 'mobile'" class="device-status-bar">
                  <div class="flex justify-between items-center px-4 py-2 bg-gray-900 text-white text-xs">
                    <span>9:41</span>
                    <div class="flex items-center space-x-1">
                      <div class="w-1 h-1 bg-white rounded-full"></div>
                      <div class="w-1 h-1 bg-white rounded-full"></div>
                      <div class="w-1 h-1 bg-white rounded-full"></div>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                
                <!-- 浏览器地址栏 (桌面端和平板) -->
                <div v-if="currentDevice !== 'mobile'" class="browser-header">
                  <div class="flex items-center px-4 py-3 bg-gray-100 border-b">
                    <div class="flex space-x-2 mr-4">
                      <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div class="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                      https://your-email-client.com
                    </div>
                  </div>
                </div>
                
                <!-- 邮件内容区域 -->
                <div class="email-preview-content" :class="contentClass">  
                  <div class="bg-white p-6 min-h-[400px]">
                    <div class="email-header mb-6">
                      <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ template?.title || '邮件标题' }}</h1>
                      <div class="text-sm text-gray-500 border-b pb-4">
                        <div>发件人: noreply@company.com</div>
                        <div>收件人: user@example.com</div>
                        <div>时间: {{ new Date().toLocaleString('zh-CN') }}</div>
                      </div>
                    </div>
                    
                    <div class="email-body prose prose-lg max-w-none" v-html="sanitizedContent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EmailTemplate } from '~/types/email'

const props = defineProps<{
  template?: EmailTemplate
}>()

const emit = defineEmits<{
  close: []
}>()

const { sanitizeHTML } = useSafeHTML()

// 控制显示状态
const show = computed(() => !!props.template)

// 设备配置
const devices = [
  { 
    type: 'desktop', 
    label: '桌面', 
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  { 
    type: 'tablet', 
    label: '平板', 
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
  },
  { 
    type: 'mobile', 
    label: '手机', 
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
  }
]

const currentDevice = ref('desktop')

// 设备框架样式
const deviceFrameClass = computed(() => {
  switch (currentDevice.value) {
    case 'mobile':
      return 'w-80 border-4 border-gray-800 rounded-3xl shadow-2xl bg-gray-800'
    case 'tablet':
      return 'w-96 border-4 border-gray-700 rounded-2xl shadow-2xl bg-gray-700'
    default:
      return 'w-full max-w-4xl border border-gray-300 rounded-lg shadow-lg bg-white'
  }
})

// 内容区域样式
const contentClass = computed(() => {
  switch (currentDevice.value) {
    case 'mobile':
      return 'max-h-96 overflow-y-auto rounded-2xl'
    case 'tablet':
      return 'max-h-[500px] overflow-y-auto rounded-xl'
    default:
      return 'max-h-[600px] overflow-y-auto rounded-lg'
  }
})

// 安全的HTML内容
const sanitizedContent = computed(() => {
  return props.template?.content ? sanitizeHTML(props.template.content) : '<p class="text-gray-500 text-center py-8">暂无内容</p>'
})

// 关闭模态框
const close = () => {
  emit('close')
}
</script>
