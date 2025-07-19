import { ref, watch, onUnmounted } from 'vue'
import { APP_CONFIG } from '~/types/constants'

/**
 * 自动保存功能 composable
 * 提供自动保存、保存状态管理和保存提示功能
 */
export const useAutoSave = () => {
  const isAutoSaveEnabled = ref(true)
  const autoSaveInterval = ref(APP_CONFIG.AUTO_SAVE_INTERVAL) // 30秒
  const lastSaveTime = ref<Date | null>(null)
  const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveMessage = ref('')
  const isDirty = ref(false) // 是否有未保存的更改
  
  let autoSaveTimer: NodeJS.Timeout | null = null
  let saveCallback: (() => Promise<void>) | null = null

  /**
   * 设置保存回调函数
   * @param callback - 保存函数
   */
  const setSaveCallback = (callback: () => Promise<void>) => {
    saveCallback = callback
  }

  /**
   * 执行保存操作
   * @param isAutoSave - 是否为自动保存
   */
  const performSave = async (isAutoSave: boolean = false) => {
    if (!saveCallback) {
      console.warn('未设置保存回调函数')
      return
    }

    if (saveStatus.value === 'saving') {
      console.log('保存操作正在进行中，跳过此次保存')
      return
    }

    try {
      saveStatus.value = 'saving'
      saveMessage.value = isAutoSave ? '自动保存中...' : '保存中...'
      
      await saveCallback()
      
      saveStatus.value = 'saved'
      saveMessage.value = isAutoSave ? '自动保存成功' : '保存成功'
      lastSaveTime.value = new Date()
      isDirty.value = false
      
      // 3秒后清除保存消息
      setTimeout(() => {
        if (saveStatus.value === 'saved') {
          saveStatus.value = 'idle'
          saveMessage.value = ''
        }
      }, 3000)
      
    } catch (error) {
      console.error('保存失败:', error)
      saveStatus.value = 'error'
      saveMessage.value = isAutoSave ? '自动保存失败' : '保存失败'
      
      // 5秒后清除错误消息
      setTimeout(() => {
        if (saveStatus.value === 'error') {
          saveStatus.value = 'idle'
          saveMessage.value = ''
        }
      }, 5000)
    }
  }

  /**
   * 手动保存
   */
  const save = async () => {
    await performSave(false)
  }

  /**
   * 启动自动保存
   */
  const startAutoSave = () => {
    if (!isAutoSaveEnabled.value || autoSaveTimer) return

    autoSaveTimer = setInterval(async () => {
      if (isDirty.value && saveStatus.value !== 'saving') {
        await performSave(true)
      }
    }, autoSaveInterval.value)

    console.log(`自动保存已启动，间隔: ${autoSaveInterval.value / 1000}秒`)
  }

  /**
   * 停止自动保存
   */
  const stopAutoSave = () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer)
      autoSaveTimer = null
      console.log('自动保存已停止')
    }
  }

  /**
   * 重启自动保存
   */
  const restartAutoSave = () => {
    stopAutoSave()
    startAutoSave()
  }

  /**
   * 标记内容为已修改
   */
  const markDirty = () => {
    isDirty.value = true
  }

  /**
   * 标记内容为已保存
   */
  const markClean = () => {
    isDirty.value = false
  }

  /**
   * 设置自动保存间隔
   * @param interval - 间隔时间（毫秒）
   */
  const setAutoSaveInterval = (interval: number) => {
    autoSaveInterval.value = Math.max(5000, interval) // 最小5秒
    if (autoSaveTimer) {
      restartAutoSave()
    }
  }

  /**
   * 启用/禁用自动保存
   * @param enabled - 是否启用
   */
  const setAutoSaveEnabled = (enabled: boolean) => {
    isAutoSaveEnabled.value = enabled
    if (enabled) {
      startAutoSave()
    } else {
      stopAutoSave()
    }
  }

  /**
   * 获取上次保存时间的友好显示
   * @returns 时间描述
   */
  const getLastSaveTimeText = (): string => {
    if (!lastSaveTime.value) return '从未保存'

    const now = new Date()
    const diff = now.getTime() - lastSaveTime.value.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) {
      return `${seconds}秒前保存`
    } else if (minutes < 60) {
      return `${minutes}分钟前保存`
    } else if (hours < 24) {
      return `${hours}小时前保存`
    } else {
      return lastSaveTime.value.toLocaleDateString()
    }
  }

  /**
   * 获取保存状态图标
   * @returns 图标类名
   */
  const getSaveStatusIcon = (): string => {
    switch (saveStatus.value) {
      case 'saving':
        return 'fas fa-spinner fa-spin'
      case 'saved':
        return 'fas fa-check text-green-500'
      case 'error':
        return 'fas fa-exclamation-triangle text-red-500'
      default:
        return isDirty.value ? 'fas fa-circle text-orange-500' : 'fas fa-save'
    }
  }

  /**
   * 获取保存状态颜色类
   * @returns CSS 类名
   */
  const getSaveStatusColor = (): string => {
    switch (saveStatus.value) {
      case 'saving':
        return 'text-blue-500'
      case 'saved':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return isDirty.value ? 'text-orange-500' : 'text-gray-500'
    }
  }

  /**
   * 检查是否需要保存提醒
   * @returns 是否需要提醒
   */
  const needsSaveReminder = (): boolean => {
    if (!isDirty.value || !lastSaveTime.value) return isDirty.value

    const now = new Date()
    const diff = now.getTime() - lastSaveTime.value.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    return minutes >= 5 // 5分钟未保存则提醒
  }

  /**
   * 页面卸载前的保存提醒
   */
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (isDirty.value) {
      const message = '您有未保存的更改，确定要离开吗？'
      event.preventDefault()
      event.returnValue = message
      return message
    }
  }

  // 监听自动保存设置变化
  watch(isAutoSaveEnabled, (enabled) => {
    if (enabled) {
      startAutoSave()
    } else {
      stopAutoSave()
    }
  })

  // 页面卸载时清理
  onUnmounted(() => {
    stopAutoSave()
    if (import.meta.client) {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  })

  // 初始化
  if (import.meta.client) {
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // 页面获得焦点时检查是否需要保存
    window.addEventListener('focus', () => {
      if (needsSaveReminder()) {
        console.log('检测到长时间未保存，建议手动保存')
      }
    })
  }

  return {
    // 状态
    isAutoSaveEnabled: readonly(isAutoSaveEnabled),
    autoSaveInterval: readonly(autoSaveInterval),
    lastSaveTime: readonly(lastSaveTime),
    saveStatus: readonly(saveStatus),
    saveMessage: readonly(saveMessage),
    isDirty: readonly(isDirty),
    
    // 方法
    setSaveCallback,
    save,
    startAutoSave,
    stopAutoSave,
    restartAutoSave,
    markDirty,
    markClean,
    setAutoSaveInterval,
    setAutoSaveEnabled,
    getLastSaveTimeText,
    getSaveStatusIcon,
    getSaveStatusColor,
    needsSaveReminder,
    handleBeforeUnload
  }
}
