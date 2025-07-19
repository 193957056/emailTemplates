import { ref, onMounted, onUnmounted } from 'vue'
import { KEYBOARD_SHORTCUTS } from '~/types/constants'

/**
 * 键盘快捷键 composable
 * 提供全局和局部快捷键支持
 */
export const useKeyboardShortcuts = () => {
  const shortcuts = ref<Map<string, () => void>>(new Map())
  const isEnabled = ref(true)
  const activeShortcuts = ref<string[]>([])

  /**
   * 标准化快捷键字符串
   * @param shortcut - 快捷键字符串
   * @returns 标准化的快捷键
   */
  const normalizeShortcut = (shortcut: string): string => {
    return shortcut
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace('cmd', 'meta')
      .replace('command', 'meta')
      .replace('ctrl', 'control')
  }

  /**
   * 从键盘事件生成快捷键字符串
   * @param event - 键盘事件
   * @returns 快捷键字符串
   */
  const getShortcutFromEvent = (event: KeyboardEvent): string => {
    const parts: string[] = []
    
    if (event.ctrlKey || event.metaKey) {
      parts.push(event.ctrlKey ? 'control' : 'meta')
    }
    if (event.altKey) parts.push('alt')
    if (event.shiftKey) parts.push('shift')
    
    // 处理特殊键
    let key = event.key.toLowerCase()
    if (key === ' ') key = 'space'
    if (key === 'escape') key = 'esc'
    
    parts.push(key)
    
    return parts.join('+')
  }

  /**
   * 注册快捷键
   * @param shortcut - 快捷键字符串 (如 'ctrl+s', 'meta+z')
   * @param callback - 回调函数
   * @param description - 快捷键描述
   */
  const registerShortcut = (
    shortcut: string, 
    callback: () => void,
    description?: string
  ) => {
    const normalizedShortcut = normalizeShortcut(shortcut)
    shortcuts.value.set(normalizedShortcut, callback)
    
    if (!activeShortcuts.value.includes(normalizedShortcut)) {
      activeShortcuts.value.push(normalizedShortcut)
    }

    console.log(`注册快捷键: ${shortcut} -> ${normalizedShortcut}${description ? ` (${description})` : ''}`)
  }

  /**
   * 注销快捷键
   * @param shortcut - 快捷键字符串
   */
  const unregisterShortcut = (shortcut: string) => {
    const normalizedShortcut = normalizeShortcut(shortcut)
    shortcuts.value.delete(normalizedShortcut)
    
    const index = activeShortcuts.value.indexOf(normalizedShortcut)
    if (index > -1) {
      activeShortcuts.value.splice(index, 1)
    }
  }

  /**
   * 执行快捷键
   * @param shortcut - 快捷键字符串
   */
  const executeShortcut = (shortcut: string) => {
    if (!isEnabled.value) return

    const normalizedShortcut = normalizeShortcut(shortcut)
    const callback = shortcuts.value.get(normalizedShortcut)
    
    if (callback) {
      callback()
      return true
    }
    
    return false
  }

  /**
   * 处理键盘事件
   * @param event - 键盘事件
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isEnabled.value) return

    // 忽略在输入框中的快捷键（除了一些特殊的）
    const target = event.target as HTMLElement
    const isInputElement = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true'

    const shortcut = getShortcutFromEvent(event)
    
    // 允许在输入框中使用的快捷键
    const allowedInInput = [
      'control+s', 'meta+s',     // 保存
      'control+z', 'meta+z',     // 撤销
      'control+y', 'meta+y',     // 重做
      'control+a', 'meta+a',     // 全选
      'control+c', 'meta+c',     // 复制
      'control+v', 'meta+v',     // 粘贴
      'control+x', 'meta+x',     // 剪切
      'esc'                      // 取消
    ]

    if (isInputElement && !allowedInInput.includes(shortcut)) {
      return
    }

    const callback = shortcuts.value.get(shortcut)
    if (callback) {
      event.preventDefault()
      event.stopPropagation()
      callback()
    }
  }

  /**
   * 启用快捷键
   */
  const enable = () => {
    isEnabled.value = true
  }

  /**
   * 禁用快捷键
   */
  const disable = () => {
    isEnabled.value = false
  }

  /**
   * 获取所有已注册的快捷键
   * @returns 快捷键列表
   */
  const getRegisteredShortcuts = () => {
    return Array.from(shortcuts.value.keys())
  }

  /**
   * 检查快捷键是否已注册
   * @param shortcut - 快捷键字符串
   * @returns 是否已注册
   */
  const isShortcutRegistered = (shortcut: string): boolean => {
    const normalizedShortcut = normalizeShortcut(shortcut)
    return shortcuts.value.has(normalizedShortcut)
  }

  /**
   * 批量注册快捷键
   * @param shortcutMap - 快捷键映射对象
   */
  const registerShortcuts = (shortcutMap: Record<string, () => void>) => {
    Object.entries(shortcutMap).forEach(([shortcut, callback]) => {
      registerShortcut(shortcut, callback)
    })
  }

  /**
   * 清除所有快捷键
   */
  const clearAllShortcuts = () => {
    shortcuts.value.clear()
    activeShortcuts.value = []
  }

  /**
   * 获取快捷键帮助信息
   * @returns 快捷键帮助文本
   */
  const getShortcutHelp = (): string[] => {
    const help: string[] = []
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

    help.push('键盘快捷键:')
    help.push('')
    
    activeShortcuts.value.forEach(shortcut => {
      let displayShortcut = shortcut
        .replace('control', isMac ? '⌃' : 'Ctrl')
        .replace('meta', isMac ? '⌘' : 'Win')
        .replace('alt', isMac ? '⌥' : 'Alt')
        .replace('shift', isMac ? '⇧' : 'Shift')
        .replace('+', isMac ? '' : '+')
      
      // 根据常见快捷键添加描述
      let description = ''
      switch (shortcut) {
        case 'control+s':
        case 'meta+s':
          description = '保存'
          break
        case 'control+z':
        case 'meta+z':
          description = '撤销'
          break
        case 'control+y':
        case 'meta+y':
          description = '重做'
          break
        case 'control+c':
        case 'meta+c':
          description = '复制'
          break
        case 'control+v':
        case 'meta+v':
          description = '粘贴'
          break
        case 'control+b':
        case 'meta+b':
          description = '加粗'
          break
        case 'control+i':
        case 'meta+i':
          description = '斜体'
          break
        case 'control+u':
        case 'meta+u':
          description = '下划线'
          break
        case 'esc':
          description = '取消/关闭'
          break
      }
      
      if (description) {
        help.push(`${displayShortcut}: ${description}`)
      }
    })
    
    return help
  }

  /**
   * 显示快捷键帮助
   */
  const showShortcutHelp = () => {
    const help = getShortcutHelp()
    console.log(help.join('\n'))
    
    // 可以在这里显示帮助模态框
    if (import.meta.client) {
      alert(help.join('\n'))
    }
  }

  /**
   * 初始化默认快捷键
   */
  const initDefaultShortcuts = (callbacks: {
    save?: () => void
    copy?: () => void
    paste?: () => void
    undo?: () => void
    redo?: () => void
    bold?: () => void
    italic?: () => void
    underline?: () => void
    help?: () => void
  }) => {
    if (callbacks.save) {
      registerShortcut('ctrl+s', callbacks.save, '保存')
      registerShortcut('meta+s', callbacks.save, '保存')
    }
    
    if (callbacks.copy) {
      registerShortcut('ctrl+c', callbacks.copy, '复制')
      registerShortcut('meta+c', callbacks.copy, '复制')
    }
    
    if (callbacks.paste) {
      registerShortcut('ctrl+v', callbacks.paste, '粘贴')
      registerShortcut('meta+v', callbacks.paste, '粘贴')
    }
    
    if (callbacks.undo) {
      registerShortcut('ctrl+z', callbacks.undo, '撤销')
      registerShortcut('meta+z', callbacks.undo, '撤销')
    }
    
    if (callbacks.redo) {
      registerShortcut('ctrl+y', callbacks.redo, '重做')
      registerShortcut('meta+y', callbacks.redo, '重做')
      registerShortcut('ctrl+shift+z', callbacks.redo, '重做')
      registerShortcut('meta+shift+z', callbacks.redo, '重做')
    }
    
    if (callbacks.bold) {
      registerShortcut('ctrl+b', callbacks.bold, '加粗')
      registerShortcut('meta+b', callbacks.bold, '加粗')
    }
    
    if (callbacks.italic) {
      registerShortcut('ctrl+i', callbacks.italic, '斜体')
      registerShortcut('meta+i', callbacks.italic, '斜体')
    }
    
    if (callbacks.underline) {
      registerShortcut('ctrl+u', callbacks.underline, '下划线')
      registerShortcut('meta+u', callbacks.underline, '下划线')
    }
    
    if (callbacks.help) {
      registerShortcut('f1', callbacks.help, '帮助')
      registerShortcut('ctrl+/', callbacks.help, '帮助')
      registerShortcut('meta+/', callbacks.help, '帮助')
    } else {
      registerShortcut('f1', showShortcutHelp, '显示快捷键帮助')
      registerShortcut('ctrl+/', showShortcutHelp, '显示快捷键帮助')
      registerShortcut('meta+/', showShortcutHelp, '显示快捷键帮助')
    }
  }

  // 生命周期
  onMounted(() => {
    if (import.meta.client) {
      document.addEventListener('keydown', handleKeyDown)
    }
  })

  onUnmounted(() => {
    if (import.meta.client) {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return {
    shortcuts: readonly(shortcuts),
    isEnabled: readonly(isEnabled),
    activeShortcuts: readonly(activeShortcuts),
    registerShortcut,
    unregisterShortcut,
    executeShortcut,
    enable,
    disable,
    getRegisteredShortcuts,
    isShortcutRegistered,
    registerShortcuts,
    clearAllShortcuts,
    getShortcutHelp,
    showShortcutHelp,
    initDefaultShortcuts
  }
}
