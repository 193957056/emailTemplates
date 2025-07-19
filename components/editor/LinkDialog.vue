<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
      <h3 class="text-lg font-semibold mb-4">插入链接</h3>
      
      <form @submit.prevent="insertLink">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              链接文本
            </label>
            <input 
              v-model="linkText" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="显示的文本"
              required
              :aria-describedby="errors.text ? 'text-error' : undefined"
            />
            <p v-if="errors.text" id="text-error" class="text-red-500 text-xs mt-1">
              {{ errors.text }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              链接地址
            </label>
            <input 
              v-model="linkUrl" 
              type="url" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              required
              :aria-describedby="errors.url ? 'url-error' : undefined"
            />
            <p v-if="errors.url" id="url-error" class="text-red-500 text-xs mt-1">
              {{ errors.url }}
            </p>
          </div>
          
          <div class="flex items-center">
            <input 
              v-model="openInNewTab"
              type="checkbox" 
              id="new-tab"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="new-tab" class="ml-2 block text-sm text-gray-700">
              在新标签页中打开
            </label>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <button 
            type="button"
            @click="close" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            :disabled="!isFormValid"
          >
            插入
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'insert-link', data: { text: string; url: string; target: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const linkText = ref('')
const linkUrl = ref('')
const openInNewTab = ref(false)
const errors = ref({
  text: '',
  url: ''
})

// 使用验证 composable
const { validateURL, sanitizeString } = useValidation()

// 表单验证
const isFormValid = computed(() => {
  return linkText.value.trim() && linkUrl.value.trim() && !errors.value.text && !errors.value.url
})

// 验证输入
function validateForm() {
  errors.value = { text: '', url: '' }
  
  // 验证链接文本
  if (!linkText.value.trim()) {
    errors.value.text = '链接文本不能为空'
  } else if (linkText.value.length > 200) {
    errors.value.text = '链接文本长度不能超过200字符'
  }
  
  // 验证链接地址
  if (!linkUrl.value.trim()) {
    errors.value.url = '链接地址不能为空'
  } else if (!validateURL(linkUrl.value)) {
    errors.value.url = '请输入有效的链接地址'
  }
}

// 插入链接
function insertLink() {
  validateForm()
  
  if (isFormValid.value) {
    const sanitizedText = sanitizeString(linkText.value, 200)
    const target = openInNewTab.value ? '_blank' : '_self'
    
    emit('insert-link', {
      text: sanitizedText,
      url: linkUrl.value,
      target
    })
    
    close()
  }
}

// 关闭对话框
function close() {
  emit('update:modelValue', false)
  resetForm()
}

// 重置表单
function resetForm() {
  linkText.value = ''
  linkUrl.value = ''
  openInNewTab.value = false
  errors.value = { text: '', url: '' }
}

// 监听对话框打开状态
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})

// 实时验证
watch([linkText, linkUrl], () => {
  if (linkText.value || linkUrl.value) {
    validateForm()
  }
})
</script>

<style scoped>
/* 对话框动画 */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bg-white {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
