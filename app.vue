<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <div class="w-full">
        <div class="py-8 border-b border-gray-200 bg-white shadow-sm">
          <h1 class="text-3xl font-bold text-center text-gray-800">
            <i class="fas fa-envelope-open-text text-blue-500 mr-3"></i>
            邮件编辑器
          </h1>
          <!-- <p class="text-center text-gray-500 mt-2">快速编写并复制邮件内容</p> -->
        </div>
        <div class="flex">
          <EmailTemplateList @select="handleTemplateSelect" />
          <div class="flex-1">
            <EmailEditor ref="emailEditor" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmailTemplate } from '~/types/email'

const emailEditor = ref<{ applyTemplate: (template: EmailTemplate) => void } | null>(null)

function handleTemplateSelect(template: EmailTemplate) {
  emailEditor.value?.applyTemplate(template)
}
</script>
