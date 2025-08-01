import type { LocalStorageData } from '~/types/email'

/**
 * 所有模板草稿的存储结构
 */
interface AllDraftsStorage {
  version: string
  drafts: {
    [templateId: string]: LocalStorageData
  }
}

/**
 * 本地存储管理 composable
 * 提供安全的本地存储功能，包括加密和版本控制
 */
export const useLocalStorage = () => {
  const STORAGE_KEY = 'email_editor_draft'
  const STORAGE_VERSION = '2.0.0' // 升级版本以支持新的存储结构

  /**
   * 简单的加密函数（生产环境建议使用更强的加密）
   * @param data - 需要加密的数据
   * @returns 加密后的字符串
   */
  const encrypt = (data: any): string => {
    try {
      const jsonStr = JSON.stringify(data)
      console.log('加密前的JSON:', jsonStr)
      
      // 使用 encodeURIComponent 来处理 Unicode 字符，然后 btoa 编码
      // 注意：这里需要额外的 escape 来确保 btoa 能正确处理
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)))
      console.log('加密后的结果:', encoded.substring(0, 50) + '...')
      return encoded
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
      console.log('解密前的数据:', encryptedData.substring(0, 50) + '...')
      
      // 对应的解密过程：atob -> escape -> decodeURIComponent -> JSON.parse
      const decoded = decodeURIComponent(escape(atob(encryptedData)))
      console.log('解密后的JSON:', decoded)
      
      const result = JSON.parse(decoded)
      console.log('解析后的对象:', result)
      return result
    } catch (error) {
      console.error('解密失败:', error)
      try {
        // 尝试直接解析（兼容旧数据）
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
   * @param templateId - 模板ID（可选）
   */
  const saveToLocalStorage = (title: string, content: string, templateId?: number | null): void => {
    if (!import.meta.client) return

    try {
      // 获取现有的存储数据
      const existingData = localStorage.getItem(STORAGE_KEY)
      let allDrafts: AllDraftsStorage
      
      // 尝试解析现有数据
      if (existingData) {
        try {
          const parsed = JSON.parse(existingData)
          // 检查是否是新格式
          if (parsed.version && parsed.drafts) {
            allDrafts = parsed
          } else {
            // 旧格式，需要迁移
            allDrafts = {
              version: STORAGE_VERSION,
              drafts: {
                'default': parsed // 将旧数据放到默认键下
              }
            }
          }
        } catch {
          // 解析失败，创建新结构
          allDrafts = {
            version: STORAGE_VERSION,
            drafts: {}
          }
        }
      } else {
        // 没有现有数据，创建新结构
        allDrafts = {
          version: STORAGE_VERSION,
          drafts: {}
        }
      }
      
      // 准备新的草稿数据
      const draftData: LocalStorageData = {
        title,
        content,
        timestamp: Date.now(),
        version: STORAGE_VERSION
      }
      
      // 使用模板ID作为键，如果没有提供则使用'default'
      const key = templateId ? templateId.toString() : 'default'
      allDrafts.drafts[key] = draftData
      
      // 保存到localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allDrafts))
    } catch (error) {
      console.error('保存到本地存储失败:', error)
    }
  }

  /**
   * 从本地存储加载数据
   * @param templateId - 模板ID（可选）
   * @returns 本地存储的数据或 null
   */
  const loadFromLocalStorage = (templateId?: number | null): LocalStorageData | null => {
    if (!import.meta.client) return null

    try {
      const storedData = localStorage.getItem(STORAGE_KEY)
      
      if (!storedData) {
        return null
      }
      
      // 尝试解析数据
      const parsed = JSON.parse(storedData)
      
      // 检查是否是新格式
      if (parsed.version && parsed.drafts) {
        // 新格式，使用模板ID获取对应的草稿
        const key = templateId ? templateId.toString() : 'default'
        return parsed.drafts[key] || null
      } else {
        // 旧格式，尝试作为单个草稿返回
        // 只有在没有指定templateId或templateId为default时才返回
        if (!templateId || templateId === null) {
          // 验证数据结构
          if (parsed && typeof parsed === 'object' && parsed.title !== undefined) {
            return parsed
          }
        }
        return null
      }
    } catch (error) {
      // 如果JSON解析失败，尝试解密旧格式数据
      try {
        const storedData = localStorage.getItem(STORAGE_KEY)
        if (storedData) {
          const decrypted = decrypt(storedData)
          if (decrypted && !templateId) {
            return decrypted
          }
        }
      } catch (decryptError) {
        // 解密也失败
      }
      
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
   * @param templateId - 模板ID（可选）
   * @returns 是否存在本地数据
   */
  const hasLocalStorage = (templateId?: number | null): boolean => {
    if (!import.meta.client) return false

    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return false
      
      const parsed = JSON.parse(data)
      
      // 检查是否是新格式
      if (parsed.version && parsed.drafts) {
        const key = templateId ? templateId.toString() : 'default'
        return !!parsed.drafts[key]
      } else {
        // 旧格式，只有在没有指定templateId时才返回true
        return !templateId && !!parsed.title
      }
    } catch (error) {
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
    console.log('检查是否需要清理过期数据...')
    const expired = isLocalStorageExpired()
    console.log('数据是否过期:', expired)
    
    if (expired) {
      clearLocalStorage()
      console.log('已清理过期的本地存储数据')
    } else {
      console.log('数据未过期，保留现有数据')
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
