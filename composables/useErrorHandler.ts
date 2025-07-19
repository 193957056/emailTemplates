import { ref } from 'vue'
import type { AppError } from '~/types/email'
import { ERROR_CODES, ERROR_MESSAGES } from '~/types/constants'

/**
 * 错误处理 composable
 * 提供统一的错误处理和用户通知功能
 */
export const useErrorHandler = () => {
  const errors = ref<AppError[]>([])
  const isLoading = ref(false)

  /**
   * 创建错误对象
   * @param code - 错误代码
   * @param message - 错误消息
   * @param details - 错误详情
   * @returns 错误对象
   */
  const createError = (
    code: string, 
    message: string, 
    details?: any
  ): AppError => {
    return {
      code,
      message,
      details,
      timestamp: new Date()
    }
  }

  /**
   * 处理错误
   * @param error - 错误对象或错误消息
   * @param context - 错误上下文
   */
  const handleError = (error: Error | string | AppError, context?: string) => {
    let appError: AppError

    if (typeof error === 'string') {
      appError = createError(ERROR_CODES.UNKNOWN_ERROR, error)
    } else if (error instanceof Error) {
      appError = createError(
        ERROR_CODES.UNKNOWN_ERROR,
        error.message,
        { stack: error.stack, context }
      )
    } else {
      appError = error
    }

    // 添加到错误列表
    errors.value.push(appError)

    // 控制台输出错误
    console.error(`[${appError.code}] ${appError.message}`, appError.details)

    // 显示用户友好的错误提示
    showErrorNotification(appError)

    return appError
  }

  /**
   * 处理验证错误
   * @param field - 字段名
   * @param message - 错误消息
   */
  const handleValidationError = (field: string, message: string) => {
    const error = createError(
      ERROR_CODES.VALIDATION_ERROR,
      message,
      { field }
    )
    return handleError(error)
  }

  /**
   * 处理网络错误
   * @param error - 网络错误
   * @param url - 请求URL
   */
  const handleNetworkError = (error: Error, url?: string) => {
    const appError = createError(
      ERROR_CODES.NETWORK_ERROR,
      ERROR_MESSAGES.NETWORK_UNAVAILABLE,
      { originalError: error.message, url }
    )
    return handleError(appError)
  }

  /**
   * 处理存储错误
   * @param error - 存储错误
   * @param operation - 操作类型
   */
  const handleStorageError = (error: Error, operation: string) => {
    const appError = createError(
      ERROR_CODES.STORAGE_ERROR,
      ERROR_MESSAGES.STORAGE_FULL,
      { originalError: error.message, operation }
    )
    return handleError(appError)
  }

  /**
   * 处理文件错误
   * @param error - 文件错误
   * @param fileName - 文件名
   */
  const handleFileError = (error: Error, fileName?: string) => {
    const appError = createError(
      ERROR_CODES.FILE_ERROR,
      error.message,
      { fileName }
    )
    return handleError(appError)
  }

  /**
   * 处理权限错误
   * @param action - 被拒绝的操作
   */
  const handlePermissionError = (action: string) => {
    const appError = createError(
      ERROR_CODES.PERMISSION_ERROR,
      ERROR_MESSAGES.PERMISSION_DENIED,
      { action }
    )
    return handleError(appError)
  }

  /**
   * 显示错误通知
   * @param error - 错误对象
   */
  const showErrorNotification = (error: AppError) => {
    // 这里可以集成通知库，如 toast、notification 等
    // 目前使用简单的 alert 作为示例
    if (import.meta.client) {
      // 可以替换为更好的通知组件
      console.warn('Error notification:', error.message)
      
      // 示例：使用浏览器通知
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('错误提示', {
          body: error.message,
          icon: '/favicon.ico'
        })
      }
    }
  }

  /**
   * 显示成功通知
   * @param message - 成功消息
   */
  const showSuccessNotification = (message: string) => {
    if (import.meta.client) {
      console.info('Success notification:', message)
      
      // 示例：使用浏览器通知
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('操作成功', {
          body: message,
          icon: '/favicon.ico'
        })
      }
    }
  }

  /**
   * 清除错误
   * @param errorId - 错误ID（可选）
   */
  const clearErrors = (errorId?: string) => {
    if (errorId) {
      const index = errors.value.findIndex(e => e.code === errorId)
      if (index > -1) {
        errors.value.splice(index, 1)
      }
    } else {
      errors.value = []
    }
  }

  /**
   * 获取最新错误
   * @returns 最新的错误对象
   */
  const getLatestError = (): AppError | null => {
    return errors.value.length > 0 ? errors.value[errors.value.length - 1] : null
  }

  /**
   * 检查是否有特定类型的错误
   * @param code - 错误代码
   * @returns 是否存在该类型错误
   */
  const hasError = (code: string): boolean => {
    return errors.value.some(error => error.code === code)
  }

  /**
   * 异步操作包装器
   * @param operation - 异步操作
   * @param errorMessage - 自定义错误消息
   * @returns 操作结果
   */
  const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    isLoading.value = true
    
    try {
      const result = await operation()
      return result
    } catch (error) {
      const message = errorMessage || '操作失败'
      handleError(error as Error, message)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 重试操作
   * @param operation - 要重试的操作
   * @param maxRetries - 最大重试次数
   * @param delay - 重试延迟（毫秒）
   * @returns 操作结果
   */
  const withRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T | null> => {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          handleError(lastError, `操作失败，已重试 ${maxRetries} 次`)
          break
        }
        
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
    
    return null
  }

  /**
   * 请求通知权限
   */
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
      } catch (error) {
        console.warn('无法请求通知权限:', error)
        return false
      }
    }
    return Notification.permission === 'granted'
  }

  return {
    errors: readonly(errors),
    isLoading: readonly(isLoading),
    handleError,
    handleValidationError,
    handleNetworkError,
    handleStorageError,
    handleFileError,
    handlePermissionError,
    showErrorNotification,
    showSuccessNotification,
    clearErrors,
    getLatestError,
    hasError,
    withErrorHandling,
    withRetry,
    requestNotificationPermission
  }
}
