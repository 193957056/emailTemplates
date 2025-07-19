<template>
  <div 
    v-if="modelValue" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
      <h3 class="text-lg font-semibold mb-4">插入表格</h3>
      
      <form @submit.prevent="insertTable">
        <div class="space-y-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                行数
              </label>
              <input 
                v-model.number="tableRows" 
                type="number" 
                min="1" 
                max="20" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                :aria-describedby="errors.rows ? 'rows-error' : undefined"
              />
              <p v-if="errors.rows" id="rows-error" class="text-red-500 text-xs mt-1">
                {{ errors.rows }}
              </p>
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                列数
              </label>
              <input 
                v-model.number="tableCols" 
                type="number" 
                min="1" 
                max="10" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                :aria-describedby="errors.cols ? 'cols-error' : undefined"
              />
              <p v-if="errors.cols" id="cols-error" class="text-red-500 text-xs mt-1">
                {{ errors.cols }}
              </p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center">
              <input 
                v-model="hasHeader"
                type="checkbox" 
                id="has-header"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="has-header" class="ml-2 block text-sm text-gray-700">
                包含表头
              </label>
            </div>
            
            <div class="flex items-center">
              <input 
                v-model="hasBorder"
                type="checkbox" 
                id="has-border"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="has-border" class="ml-2 block text-sm text-gray-700">
                显示边框
              </label>
            </div>
          </div>
          
          <!-- 表格预览 -->
          <div class="border border-gray-200 rounded p-3 bg-gray-50">
            <div class="text-xs text-gray-500 mb-2">预览</div>
            <div class="overflow-auto max-h-32">
              <table 
                class="w-full text-xs"
                :class="{ 'border-collapse': hasBorder }"
                :style="{ borderCollapse: hasBorder ? 'collapse' : 'separate' }"
              >
                <thead v-if="hasHeader">
                  <tr>
                    <th 
                      v-for="col in tableCols" 
                      :key="`header-${col}`"
                      class="p-1 bg-gray-100"
                      :class="{ 'border border-gray-300': hasBorder }"
                    >
                      列{{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in tableRows" :key="`row-${row}`">
                    <td 
                      v-for="col in tableCols" 
                      :key="`cell-${row}-${col}`"
                      class="p-1"
                      :class="{ 'border border-gray-300': hasBorder }"
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
  (e: 'insert-table', data: { 
    rows: number; 
    cols: number; 
    hasHeader: boolean; 
    hasBorder: boolean 
  }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tableRows = ref(3)
const tableCols = ref(3)
const hasHeader = ref(true)
const hasBorder = ref(true)
const errors = ref({
  rows: '',
  cols: ''
})

// 表单验证
const isFormValid = computed(() => {
  return tableRows.value >= 1 && 
         tableRows.value <= 20 && 
         tableCols.value >= 1 && 
         tableCols.value <= 10 &&
         !errors.value.rows && 
         !errors.value.cols
})

// 验证输入
function validateForm() {
  errors.value = { rows: '', cols: '' }
  
  // 验证行数
  if (tableRows.value < 1) {
    errors.value.rows = '行数不能少于1'
  } else if (tableRows.value > 20) {
    errors.value.rows = '行数不能超过20'
  }
  
  // 验证列数
  if (tableCols.value < 1) {
    errors.value.cols = '列数不能少于1'
  } else if (tableCols.value > 10) {
    errors.value.cols = '列数不能超过10'
  }
}

// 插入表格
function insertTable() {
  validateForm()
  
  if (isFormValid.value) {
    emit('insert-table', {
      rows: tableRows.value,
      cols: tableCols.value,
      hasHeader: hasHeader.value,
      hasBorder: hasBorder.value
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
  tableRows.value = 3
  tableCols.value = 3
  hasHeader.value = true
  hasBorder.value = true
  errors.value = { rows: '', cols: '' }
}

// 监听对话框打开状态
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})

// 实时验证
watch([tableRows, tableCols], () => {
  validateForm()
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
