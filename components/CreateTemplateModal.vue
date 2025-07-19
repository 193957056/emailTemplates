<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
      <!-- 模态框标题 -->
      <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
          <i class="fas fa-plus-circle mr-2 text-blue-500"></i>
          创建新模板
        </h2>
        <button 
          @click="close"
          class="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <i class="fas fa-times text-gray-500"></i>
        </button>
      </div>
      
      <!-- 模态框内容 -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <form @submit.prevent="createTemplate">
          <!-- 基本信息 -->
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" for="name">
                模板名称 <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入模板名称"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" for="category">
                模板分类 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="category"
                  v-model="form.category"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
                >
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                  <option value="custom">自定义分类</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 自定义分类输入框 -->
          <div v-if="form.category === 'custom'" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2" for="customCategory">
              自定义分类名称 <span class="text-red-500">*</span>
            </label>
            <input
              id="customCategory"
              v-model="form.customCategory"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入自定义分类名称"
            />
          </div>
          
          <!-- 邮件标题 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2" for="title">
              邮件标题 <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入邮件标题"
            />
          </div>
          
          <!-- 邮件内容 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2" for="content">
              邮件内容 <span class="text-red-500">*</span>
            </label>
            <div class="border border-gray-300 rounded-lg p-2 min-h-[200px] bg-white">
              <textarea
                id="content"
                v-model="form.content"
                required
                class="w-full h-[200px] px-2 py-2 focus:outline-none resize-none"
                placeholder="请输入邮件内容（支持HTML格式）"
              ></textarea>
            </div>
            <p class="text-xs text-gray-500 mt-1">支持HTML格式，可以添加样式和格式</p>
          </div>
          
          <!-- 底部按钮 -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="close"
              class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <i class="fas fa-spinner fa-spin mr-2"></i> 保存中...
              </span>
              <span v-else>保存模板</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { emailTemplates } from '~/data/emailTemplates'
import type { EmailTemplate } from '~/types/email'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', template: EmailTemplate): void
}>()

const isSubmitting = ref(false)

const form = ref({
  name: '',
  category: '工作',
  customCategory: '',
  title: '',
  content: ''
})

// 获取现有分类
const categories = computed(() => {
  return [...new Set(emailTemplates.map(template => template.category))]
})

function close() {
  emit('close')
  // 重置表单
  setTimeout(() => {
    form.value = {
      name: '',
      category: '工作',
      customCategory: '',
      title: '',
      content: ''
    }
  }, 300)
}

function createTemplate() {
  isSubmitting.value = true
  
  try {
    // 创建新模板对象
    const newTemplate: EmailTemplate = {
      id: Math.max(0, ...emailTemplates.map(t => t.id)) + 1, // 生成新ID
      name: form.value.name,
      category: form.value.category === 'custom' ? form.value.customCategory : form.value.category,
      title: form.value.title,
      content: form.value.content
    }
    
    // 在真实应用中，这里应该发送请求到服务器保存模板
    // 但在此示例中，我们只是将模板添加到前端数组中
    emailTemplates.push(newTemplate)
    
    // 触发创建成功事件
    emit('created', newTemplate)
    
    // 关闭模态框
    close()
  } finally {
    isSubmitting.value = false
  }
}
</script> 