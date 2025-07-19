import type { LocalStorageData } from '~/types/email'

/**
 * 本地存储管理 composable
 * 提供安全的本地存储功能，包括加密和版本控制
 */
export const useLocalStorage = () => {
  const STORAGE_KEY = 'email_editor_draft'
  const STORAGE_VERSION = '1.0.0'

  /**
   * 简单的加密函数（生产环境建议使用更强的加密）
   * @param data - 需要加密的数据
   * @returns 加密后的字符串
   */
  const encrypt = (data: any): string => {
    try {
      // 使用 encodeURIComponent 和 btoa 来处理 Unicode 字符
      return btoa(encodeURIComponent(JSON.stringify(data)))
    } catch (error) {
      console.error('加密失败:', error)
      return JSON.stringify(data)
    }
  }

  /**
   * 简单的解密函数
   * @param encryptedData - 加密的数据
   * @returns 解密后的数据
   */
  const decrypt = (encryptedData: string): any => {
    try {
      // 对应的解密过程：atob -> decodeURIComponent -> JSON.parse
      return JSON.parse(decodeURIComponent(atob(encryptedData)))
    } catch (error) {
      console.error('解密失败:', error)
      try {
        return JSON.parse(encryptedData)
      } catch {
        return null
      }
    }
  }

  /**
   * 保存数据到本地存储
   * @param title - 邮件标题
   * @param content - 邮件内容
   */
  const saveToLocalStorage = (title: string, content: string): void => {
    if (!import.meta.client) return

    try {
      const data: LocalStorageData = {
        title,
        content,
        timestamp: Date.now(),
        version: STORAGE_VERSION
      }

      const encryptedData = encrypt(data)
      localStorage.setItem(STORAGE_KEY, encryptedData)
      
      console.log('数据已保存到本地存储')
    } catch (error) {
      console.error('保存到本地存储失败:', error)
    }
  }

  /**
   * 从本地存储加载数据
   * @returns 本地存储的数据或 null
   */
  const loadFromLocalStorage = (): LocalStorageData | null => {
    if (!import.meta.client) return null

    try {
      const encryptedData = localStorage.getItem(STORAGE_KEY)
      if (!encryptedData) return null

      const data = decrypt(encryptedData)
      
      // 验证数据结构
      if (!data || typeof data !== 'object') {
        console.warn('本地存储数据格式无效')
        return null
      }

      // 检查版本兼容性
      if (data.version !== STORAGE_VERSION) {
        console.warn('本地存储数据版本不兼容，将清除旧数据')
        clearLocalStorage()
        return null
      }

      return data
    } catch (error) {
      console.error('从本地存储加载失败:', error)
      return null
    }
  }

  /**
   * 清除本地存储
   */
  const clearLocalStorage = (): void => {
    if (!import.meta.client) return

    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log('本地存储已清除')
    } catch (error) {
      console.error('清除本地存储失败:', error)
    }
  }

  /**
   * 检查是否有本地存储的数据
   * @returns 是否存在本地数据
   */
  const hasLocalStorage = (): boolean => {
    if (!import.meta.client) return false

    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return !!data
    } catch (error) {
      console.error('检查本地存储失败:', error)
      return false
    }
  }

  /**
   * 获取本地存储数据的时间戳
   * @returns 时间戳或 null
   */
  const getLocalStorageTimestamp = (): number | null => {
    const data = loadFromLocalStorage()
    return data?.timestamp || null
  }

  /**
   * 检查本地存储数据是否过期
   * @param maxAge - 最大存储时间（毫秒），默认 7 天
   * @returns 是否过期
   */
  const isLocalStorageExpired = (maxAge: number = 7 * 24 * 60 * 60 * 1000): boolean => {
    const timestamp = getLocalStorageTimestamp()
    if (!timestamp) return true

    return Date.now() - timestamp > maxAge
  }

  /**
   * 自动清理过期的本地存储
   */
  const cleanupExpiredStorage = (): void => {
    if (isLocalStorageExpired()) {
      clearLocalStorage()
      console.log('已清理过期的本地存储数据')
    }
  }

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    hasLocalStorage,
    getLocalStorageTimestamp,
    isLocalStorageExpired,
    cleanupExpiredStorage
  }
}
