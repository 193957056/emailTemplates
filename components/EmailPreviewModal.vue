<template>
  <div>
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modelValue" class="modal-overlay" @click="close">
          <div class="modal-content" @click.stop>
            <!-- 模态框头部 -->
            <div class="modal-header">
              <h3 class="modal-title">
                <i class="fas fa-eye text-blue-500 mr-2"></i>
                {{ template?.name }}
              </h3>
              <button class="modal-close" @click="close">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <!-- 模态框内容 -->
            <div class="modal-body">
              <div class="mb-4">
                <div class="text-sm text-gray-500 mb-1">邮件标题</div>
                <div class="text-gray-700 font-medium">{{ template?.title }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 mb-1">邮件内容</div>
                <div 
                  class="preview-content"
                  v-html="template?.content"
                ></div>
              </div>
            </div>
            <!-- 模态框底部 -->
            <div class="modal-footer">
              <div class="flex items-center gap-2">
                <!-- 添加响应式预览按钮 -->
                <button 
                  class="btn-outline"
                  @click="openResponsivePreview"
                  title="在不同设备上预览"
                >
                  <i class="fas fa-mobile-alt mr-1"></i>
                  响应式预览
                </button>
                <!-- 隐藏翻译按钮 -->
                <!--
                <button 
                  class="btn-outline"
                  @click="openLanguageTranslator"
                  title="翻译到其他语言"
                >
                  <i class="fas fa-language mr-1"></i>
                  翻译
                </button>
                -->
              </div>
              <button 
                class="btn-primary"
                @click="close"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- 响应式预览模态框 -->
    <ResponsivePreviewModal
      v-model="showResponsivePreviewModal"
      :template="template"
      @update:template="$emit('update:template', $event)"
    />
    <!-- 语言翻译模态框 -->
    <LanguageTranslatorModal
      v-model="showLanguageTranslatorModal"
      :template="template"
      @translated="$emit('translated', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { EmailTemplate } from '~/types/email'
import ResponsivePreviewModal from '~/components/ResponsivePreviewModal.vue'
import LanguageTranslatorModal from '~/components/LanguageTranslatorModal.vue'
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
  template?: EmailTemplate
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:template', value: EmailTemplate): void
  (e: 'translated', value: EmailTemplate): void
}>()

// 响应式预览和语言翻译模态框状态
const showResponsivePreviewModal = ref(false)
const showLanguageTranslatorModal = ref(false)

function close() {
  emit('update:modelValue', false)
}

// 打开响应式预览
function openResponsivePreview() {
  if (props.template) {
    showResponsivePreviewModal.value = true
  }
}

// 打开语言翻译器
function openLanguageTranslator() {
  if (props.template) {
    showLanguageTranslatorModal.value = true
  }
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

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  color: #4b5563;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}

.btn-outline:hover {
  background-color: #f3f4f6;
}

.preview-content {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9fafb;
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