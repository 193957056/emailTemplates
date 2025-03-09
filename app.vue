<template>
  <div class="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
    <div class="flex-1 flex items-center justify-center overflow-hidden">
      <div class="w-full h-full">
        <div class="py-8 border-b border-gray-200 bg-white shadow-sm">
          <h1 class="text-3xl font-bold text-center text-gray-800">
            <i class="fas fa-envelope-open-text text-blue-500 mr-3"></i>
            邮件编辑器
          </h1>
          <!-- <p class="text-center text-gray-500 mt-2">快速编写并复制邮件内容</p> -->
        </div>
        <div class="flex h-[calc(100vh-88px)]">
          <ClientOnly>
            <EmailTemplateList @select="handleTemplateSelect" />
            <div class="flex-1 overflow-hidden">
              <EmailEditor ref="emailEditor" />
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { EmailTemplate } from '~/types/email'

const emailEditor = ref<{ applyTemplate: (template: EmailTemplate) => void } | null>(null)

function handleTemplateSelect(template: EmailTemplate) {
  // 确保在客户端环境下执行
  if (process.client) {
    // 使用 nextTick 确保组件已挂载
    nextTick(() => {
      emailEditor.value?.applyTemplate(template)
    })
  }
}
</script>

<style>
html, body {
  height: 100%;
  overflow: hidden;
}
</style>
