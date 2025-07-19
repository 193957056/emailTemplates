import type { EmailTemplate, EmailValidationErrors } from '~/types/email'

/**
 * 输入验证 composable
 * 提供各种验证功能，确保数据安全性和完整性
 */
export const useValidation = () => {
  /**
   * 验证邮箱地址格式
   * @param email - 邮箱地址
   * @returns 是否有效
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 验证 URL 格式
   * @param url - URL 地址
   * @returns 是否有效
   */
  const validateURL = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * 验证邮件模板数据
   * @param template - 邮件模板对象
   * @returns 验证结果
   */
  const validateTemplate = (template: Partial<EmailTemplate>) => {
    const errors: EmailValidationErrors = {}

    // 验证标题
    if (!template.title?.trim()) {
      errors.title = '标题不能为空'
    } else if (template.title.length > 200) {
      errors.title = '标题长度不能超过200字符'
    } else if (template.title.length < 2) {
      errors.title = '标题长度不能少于2字符'
    }

    // 验证内容
    if (!template.content?.trim()) {
      errors.content = '内容不能为空'
    } else if (template.content.length > 50000) {
      errors.content = '内容长度不能超过50000字符'
    } else if (template.content.length < 10) {
      errors.content = '内容长度不能少于10字符'
    }

    // 验证名称
    if (!template.name?.trim()) {
      errors.name = '模板名称不能为空'
    } else if (template.name.length > 100) {
      errors.name = '模板名称长度不能超过100字符'
    }

    // 验证分类
    if (!template.category?.trim()) {
      errors.category = '请选择模板分类'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * 验证文件大小
   * @param file - 文件对象
   * @param maxSizeMB - 最大文件大小（MB）
   * @returns 是否有效
   */
  const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
  }

  /**
   * 验证文件类型
   * @param file - 文件对象
   * @param allowedTypes - 允许的文件类型数组
   * @returns 是否有效
   */
  const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type)
  }

  /**
   * 清理和验证字符串输入
   * @param input - 输入字符串
   * @param maxLength - 最大长度
   * @returns 清理后的字符串
   */
  const sanitizeString = (input: string, maxLength?: number): string => {
    let cleaned = input.trim()
    
    // 移除潜在的恶意字符
    cleaned = cleaned.replace(/[<>\"']/g, '')
    
    // 限制长度
    if (maxLength && cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength)
    }
    
    return cleaned
  }

  /**
   * 验证颜色值格式
   * @param color - 颜色值（hex 格式）
   * @returns 是否有效
   */
  const validateColor = (color: string): boolean => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexColorRegex.test(color)
  }

  return {
    validateEmail,
    validateURL,
    validateTemplate,
    validateFileSize,
    validateFileType,
    sanitizeString,
    validateColor
  }
}
