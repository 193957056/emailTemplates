// 邮件模板分类枚举
export type EmailCategory = 'work' | 'personal' | 'formal' | 'notification'

// 支持的语言类型
export type SupportedLanguage = 'zh-CN' | 'en-US' | 'ja-JP'

// 设备类型
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

// 邮件模板接口
export interface EmailTemplate {
    id: number
    name: string
    title: string
    content: string
    category: EmailCategory
    language: SupportedLanguage
    createdAt: Date
    updatedAt: Date
    tags?: string[]
    isActive: boolean
    author?: string
    description?: string
}

// 邮件编辑器状态
export interface EmailEditorState {
    title: string
    content: string
    isDirty: boolean
    lastSaved?: Date
}

// 表单验证错误
export interface EmailValidationErrors {
    title?: string
    content?: string
    category?: string
    name?: string
    language?: string
}

// 应用错误接口
export interface AppError {
    code: string
    message: string
    details?: any
    timestamp: Date
}

// 语言配置
export interface Language {
    code: SupportedLanguage
    name: string
    nativeName: string
    flag?: string
}

// 颜色配置
export interface ColorOption {
    label: string
    value: string
    category?: 'common' | 'extended' | 'custom'
}

// 工具栏工具配置
export interface ToolbarTool {
    label: string
    command: string
    icon: string
    category: 'format' | 'align' | 'list' | 'indent' | 'insert'
}

// 本地存储数据结构
export interface LocalStorageData {
    title: string
    content: string
    timestamp: number
    version: string
}