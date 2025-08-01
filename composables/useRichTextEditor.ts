import { ref, nextTick } from 'vue'

/**
 * 富文本编辑器 composable
 * 提供富文本编辑功能和命令执行
 */
export const useRichTextEditor = () => {
  const editorRef = ref<HTMLElement | null>(null)
  const currentColor = ref('#000000')
  const currentBgColor = ref('#ffffff')

  /**
   * 执行编辑命令
   * @param command - 编辑命令
   * @param value - 命令参数（可选）
   */
  const executeCommand = (command: string, value?: string): void => {
    if (!import.meta.client) return

    try {
      // 保存当前光标位置
      const selection = window.getSelection()
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null
      
      document.execCommand(command, false, value)

      // 保持编辑器焦点
      if (editorRef.value) {
        editorRef.value.focus()
        
        // 如果有保存的光标位置，尝试恢复
        if (range && selection && selection.rangeCount > 0) {
          try {
            // 对于某些命令，光标会自动保持在正确位置
            // 只有在需要时才手动恢复
            if (['insertHTML', 'insertImage', 'insertHorizontalRule'].includes(command)) {
              // 这些命令会改变DOM结构，让浏览器自己处理光标
              return
            }
          } catch (error) {
            console.debug('恢复光标位置时出错', error)
          }
        }
      }
    } catch (error) {
      console.error(`执行命令 ${command} 失败:`, error)
    }
  }

  /**
   * 应用标题级别
   * @param event - 选择事件
   */
  const applyHeading = (event: Event): void => {
    const target = event.target as HTMLSelectElement
    const value = target.value

    if (value) {
      executeCommand('formatBlock', `<${value}>`)
    }

    // 重置选择器
    target.value = ''
  }

  /**
   * 应用字体大小
   * @param event - 选择事件
   */
  const applyFontSize = (event: Event): void => {
    const target = event.target as HTMLSelectElement
    const value = target.value

    if (value) {
      // 使用 CSS 样式设置字体大小
      executeCommand('fontSize', '3') // 先设置一个基础大小

      // 然后通过 CSS 覆盖
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const span = document.createElement('span')
        span.style.fontSize = value

        try {
          range.surroundContents(span)
        } catch (error) {
          // 如果选择范围包含多个元素，使用不同的方法
          const contents = range.extractContents()
          span.appendChild(contents)
          range.insertNode(span)
        }
      }
    }

    // 重置选择器
    target.value = ''
  }

  /**
   * 设置文字颜色
   * @param color - 颜色值
   */
  const setTextColor = (color: string): void => {
    currentColor.value = color
    executeCommand('foreColor', color)
  }

  /**
   * 设置背景颜色
   * @param color - 颜色值
   */
  const setBackgroundColor = (color: string): void => {
    currentBgColor.value = color
    executeCommand('backColor', color)
  }

  /**
   * 插入链接
   * @param data - 链接数据
   */
  const insertLink = (data: { text: string; url: string; target: string }): void => {
    const { text, url, target } = data

    // 创建链接 HTML
    const linkHtml = `<a href="${url}" target="${target}" rel="${target === '_blank' ? 'noopener noreferrer' : ''}">${text}</a>`

    // 插入 HTML
    executeCommand('insertHTML', linkHtml)
  }

  /**
   * 插入表格
   * @param data - 表格数据
   */
  const insertTable = (data: { rows: number; cols: number; hasHeader: boolean; hasBorder: boolean }): void => {
    const { rows, cols, hasHeader, hasBorder } = data

    let tableHtml = '<table'

    // 添加样式
    const styles = []
    if (hasBorder) {
      styles.push('border-collapse: collapse')
      styles.push('border: 1px solid #ccc')
    }
    styles.push('width: 100%')

    if (styles.length > 0) {
      tableHtml += ` style="${styles.join('; ')}"`
    }

    tableHtml += '>'

    // 添加表头
    if (hasHeader) {
      tableHtml += '<thead><tr>'
      for (let col = 1; col <= cols; col++) {
        tableHtml += `<th style="${hasBorder ? 'border: 1px solid #ccc; ' : ''}padding: 8px; background-color: #f5f5f5;">列${col}</th>`
      }
      tableHtml += '</tr></thead>'
    }

    // 添加表体
    tableHtml += '<tbody>'
    for (let row = 1; row <= rows; row++) {
      tableHtml += '<tr>'
      for (let col = 1; col <= cols; col++) {
        tableHtml += `<td style="${hasBorder ? 'border: 1px solid #ccc; ' : ''}padding: 8px;">&nbsp;</td>`
      }
      tableHtml += '</tr>'
    }
    tableHtml += '</tbody></table><br>'

    // 插入表格
    executeCommand('insertHTML', tableHtml)
  }

  /**
   * 插入分割线
   */
  const insertHorizontalRule = (): void => {
    executeCommand('insertHorizontalRule')
  }

  /**
   * 清除格式
   */
  const clearFormatting = (): void => {
    executeCommand('removeFormat')
  }

  /**
   * 获取编辑器内容
   * @returns HTML 内容
   */
  const getContent = (): string => {
    return editorRef.value?.innerHTML || ''
  }

  /**
   * 设置编辑器内容
   * @param content - HTML 内容
   */
  const setContent = (content: string): void => {
    if (editorRef.value) {
      editorRef.value.innerHTML = content
    }
  }

  /**
   * 聚焦编辑器
   */
  const focusEditor = (): void => {
    if (editorRef.value) {
      editorRef.value.focus()
    }
  }

  /**
   * 检查格式是否激活
   * @param command - 命令名称
   * @returns 是否激活
   */
  const isFormatActive = (command: string): boolean => {
    if (!import.meta.client) return false

    try {
      return document.queryCommandState(command)
    } catch (error) {
      console.error(`检查命令状态 ${command} 失败:`, error)
      return false
    }
  }

  /**
   * 设置编辑器引用
   * @param element - 编辑器元素
   */
  const setEditorRef = (element: HTMLElement | null): void => {
    editorRef.value = element
  }

  return {
    editorRef,
    currentColor,
    currentBgColor,
    executeCommand,
    applyHeading,
    applyFontSize,
    setTextColor,
    setBackgroundColor,
    insertLink,
    insertTable,
    insertHorizontalRule,
    clearFormatting,
    getContent,
    setContent,
    focusEditor,
    isFormatActive,
    setEditorRef
  }
}
