import type { EmailCategory, SupportedLanguage, Language, ColorOption, ToolbarTool } from './email'

/**
 * 应用常量定义
 */

// 邮件分类选项
export const EMAIL_CATEGORIES: Record<EmailCategory, string> = {
  work: '工作邮件',
  personal: '个人邮件',
  formal: '正式邮件',
  notification: '通知邮件'
} as const

// 支持的语言配置
export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳'
  },
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵'
  }
] as const

// 颜色选项配置
export const COLOR_OPTIONS: ColorOption[] = [
  // 常用颜色
  { label: '黑色', value: '#000000', category: 'common' },
  { label: '深灰', value: '#666666', category: 'common' },
  { label: '红色', value: '#FF0000', category: 'common' },
  { label: '蓝色', value: '#0000FF', category: 'common' },
  { label: '绿色', value: '#008000', category: 'common' },
  
  // 扩展颜色
  { label: '深红', value: '#8B0000', category: 'extended' },
  { label: '橙色', value: '#FFA500', category: 'extended' },
  { label: '紫色', value: '#800080', category: 'extended' },
  { label: '棕色', value: '#A52A2A', category: 'extended' },
  { label: '海蓝', value: '#1E90FF', category: 'extended' },
  { label: '深绿', value: '#006400', category: 'extended' },
  { label: '粉色', value: '#FF69B4', category: 'extended' },
  { label: '青色', value: '#00CED1', category: 'extended' },
  { label: '金色', value: '#FFD700', category: 'extended' },
  { label: '深紫', value: '#4B0082', category: 'extended' },
  
  // 背景色
  { label: '白色', value: '#FFFFFF', category: 'common' },
  { label: '浅灰', value: '#F5F5F5', category: 'common' },
  { label: '浅黄', value: '#FFF9C4', category: 'extended' },
  { label: '浅蓝', value: '#E3F2FD', category: 'extended' },
  { label: '浅绿', value: '#E8F5E9', category: 'extended' }
] as const

// 工具栏工具配置
export const TOOLBAR_TOOLS: Record<string, ToolbarTool[]> = {
  format: [
    { label: '加粗', command: 'bold', icon: 'fas fa-bold', category: 'format' },
    { label: '斜体', command: 'italic', icon: 'fas fa-italic', category: 'format' },
    { label: '下划线', command: 'underline', icon: 'fas fa-underline', category: 'format' },
    { label: '删除线', command: 'strikeThrough', icon: 'fas fa-strikethrough', category: 'format' }
  ],
  align: [
    { label: '左对齐', command: 'justifyLeft', icon: 'fas fa-align-left', category: 'align' },
    { label: '居中对齐', command: 'justifyCenter', icon: 'fas fa-align-center', category: 'align' },
    { label: '右对齐', command: 'justifyRight', icon: 'fas fa-align-right', category: 'align' },
    { label: '两端对齐', command: 'justifyFull', icon: 'fas fa-align-justify', category: 'align' }
  ],
  list: [
    { label: '无序列表', command: 'insertUnorderedList', icon: 'fas fa-list-ul', category: 'list' },
    { label: '有序列表', command: 'insertOrderedList', icon: 'fas fa-list-ol', category: 'list' }
  ],
  indent: [
    { label: '减少缩进', command: 'outdent', icon: 'fas fa-outdent', category: 'indent' },
    { label: '增加缩进', command: 'indent', icon: 'fas fa-indent', category: 'indent' }
  ],
  insert: [
    { label: '插入链接', command: 'createLink', icon: 'fas fa-link', category: 'insert' },
    { label: '插入图片', command: 'insertImage', icon: 'fas fa-image', category: 'insert' },
    { label: '插入表格', command: 'insertTable', icon: 'fas fa-table', category: 'insert' },
    { label: '插入分割线', command: 'insertHorizontalRule', icon: 'fas fa-minus', category: 'insert' }
  ]
} as const

// 字体大小选项
export const FONT_SIZES = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '36px', value: '36px' },
  { label: '48px', value: '48px' }
] as const

// 标题级别选项
export const HEADING_LEVELS = [
  { label: '正文', value: 'p' },
  { label: '标题 1', value: 'h1' },
  { label: '标题 2', value: 'h2' },
  { label: '标题 3', value: 'h3' },
  { label: '标题 4', value: 'h4' },
  { label: '标题 5', value: 'h5' },
  { label: '标题 6', value: 'h6' }
] as const

// 设备类型配置
export const DEVICE_TYPES = [
  { type: 'desktop', label: '桌面端', width: 1200, icon: 'fas fa-desktop' },
  { type: 'tablet', label: '平板端', width: 768, icon: 'fas fa-tablet-alt' },
  { type: 'mobile', label: '移动端', width: 375, icon: 'fas fa-mobile-alt' }
] as const

// 本地存储键名
export const STORAGE_KEYS = {
  EMAIL_DRAFT: 'email_editor_draft',
  USER_PREFERENCES: 'email_editor_preferences',
  RECENT_TEMPLATES: 'email_editor_recent_templates',
  CUSTOM_COLORS: 'email_editor_custom_colors'
} as const

// 应用配置
export const APP_CONFIG = {
  MAX_TITLE_LENGTH: 200,
  MAX_CONTENT_LENGTH: 50000,
  MAX_TEMPLATE_NAME_LENGTH: 100,
  AUTO_SAVE_INTERVAL: 30000, // 30秒
  STORAGE_EXPIRY_DAYS: 7,
  MAX_RECENT_TEMPLATES: 10,
  MAX_CUSTOM_COLORS: 20,
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  DEBOUNCE_DELAY: 300 // 防抖延迟
} as const

// 错误代码
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  FILE_ERROR: 'FILE_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

// 成功消息
export const SUCCESS_MESSAGES = {
  TEMPLATE_SAVED: '模板保存成功',
  TEMPLATE_DELETED: '模板删除成功',
  TEMPLATE_EXPORTED: '模板导出成功',
  CONTENT_COPIED: '内容复制成功',
  SETTINGS_SAVED: '设置保存成功'
} as const

// 错误消息
export const ERROR_MESSAGES = {
  TITLE_REQUIRED: '标题不能为空',
  TITLE_TOO_LONG: '标题长度不能超过200字符',
  CONTENT_REQUIRED: '内容不能为空',
  CONTENT_TOO_LONG: '内容长度不能超过50000字符',
  INVALID_EMAIL: '邮箱格式不正确',
  INVALID_URL: '链接格式不正确',
  FILE_TOO_LARGE: '文件大小不能超过5MB',
  UNSUPPORTED_FILE_TYPE: '不支持的文件类型',
  STORAGE_FULL: '存储空间不足',
  NETWORK_UNAVAILABLE: '网络连接不可用',
  PERMISSION_DENIED: '权限不足',
  UNKNOWN_ERROR: '未知错误，请重试'
} as const

// 快捷键配置
export const KEYBOARD_SHORTCUTS = {
  SAVE: 'Ctrl+S',
  COPY: 'Ctrl+C',
  PASTE: 'Ctrl+V',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Y',
  BOLD: 'Ctrl+B',
  ITALIC: 'Ctrl+I',
  UNDERLINE: 'Ctrl+U',
  FIND: 'Ctrl+F',
  REPLACE: 'Ctrl+H'
} as const
