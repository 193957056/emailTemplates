import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * 可访问性 composable
 * 提供键盘导航、焦点管理、屏幕阅读器支持等功能
 */
export const useAccessibility = () => {
  const focusableElements = ref<HTMLElement[]>([])
  const currentFocusIndex = ref(-1)
  const announcements = ref<string[]>([])
  const isScreenReaderActive = ref(false)

  // 可聚焦元素选择器
  const FOCUSABLE_SELECTORS = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')

  /**
   * 检测屏幕阅读器是否激活
   */
  const detectScreenReader = () => {
    if (!import.meta.client) return false

    // 检测常见的屏幕阅读器
    const userAgent = navigator.userAgent.toLowerCase()
    const hasScreenReader = 
      userAgent.includes('nvda') ||
      userAgent.includes('jaws') ||
      userAgent.includes('dragon') ||
      userAgent.includes('zoomtext') ||
      // 检测是否启用了辅助功能
      window.speechSynthesis !== undefined ||
      // 检测媒体查询
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    isScreenReaderActive.value = hasScreenReader
    return hasScreenReader
  }

  /**
   * 更新可聚焦元素列表
   * @param container - 容器元素
   */
  const updateFocusableElements = (container: HTMLElement = document.body) => {
    const elements = Array.from(
      container.querySelectorAll(FOCUSABLE_SELECTORS)
    ) as HTMLElement[]

    // 过滤掉不可见的元素
    focusableElements.value = elements.filter(element => {
      const style = window.getComputedStyle(element)
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.offsetWidth > 0 &&
        element.offsetHeight > 0
      )
    })
  }

  /**
   * 设置焦点到指定元素
   * @param element - 目标元素
   * @param options - 焦点选项
   */
  const setFocus = (element: HTMLElement, options?: FocusOptions) => {
    if (!element) return

    nextTick(() => {
      element.focus(options)
      
      // 更新当前焦点索引
      const index = focusableElements.value.indexOf(element)
      if (index !== -1) {
        currentFocusIndex.value = index
      }

      // 滚动到可见区域
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    })
  }

  /**
   * 移动焦点到下一个元素
   */
  const focusNext = () => {
    if (focusableElements.value.length === 0) return

    const nextIndex = (currentFocusIndex.value + 1) % focusableElements.value.length
    const nextElement = focusableElements.value[nextIndex]
    
    if (nextElement) {
      setFocus(nextElement)
    }
  }

  /**
   * 移动焦点到上一个元素
   */
  const focusPrevious = () => {
    if (focusableElements.value.length === 0) return

    const prevIndex = currentFocusIndex.value <= 0 
      ? focusableElements.value.length - 1 
      : currentFocusIndex.value - 1
    const prevElement = focusableElements.value[prevIndex]
    
    if (prevElement) {
      setFocus(prevElement)
    }
  }

  /**
   * 移动焦点到第一个元素
   */
  const focusFirst = () => {
    if (focusableElements.value.length > 0) {
      setFocus(focusableElements.value[0])
    }
  }

  /**
   * 移动焦点到最后一个元素
   */
  const focusLast = () => {
    const lastIndex = focusableElements.value.length - 1
    if (lastIndex >= 0) {
      setFocus(focusableElements.value[lastIndex])
    }
  }

  /**
   * 创建焦点陷阱
   * @param container - 容器元素
   * @returns 清理函数
   */
  const createFocusTrap = (container: HTMLElement) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      updateFocusableElements(container)
      
      if (focusableElements.value.length === 0) return

      const firstElement = focusableElements.value[0]
      const lastElement = focusableElements.value[focusableElements.value.length - 1]
      const activeElement = document.activeElement as HTMLElement

      if (event.shiftKey) {
        // Shift + Tab (向后)
        if (activeElement === firstElement) {
          event.preventDefault()
          setFocus(lastElement)
        }
      } else {
        // Tab (向前)
        if (activeElement === lastElement) {
          event.preventDefault()
          setFocus(firstElement)
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    
    // 设置初始焦点
    updateFocusableElements(container)
    if (focusableElements.value.length > 0) {
      setFocus(focusableElements.value[0])
    }

    // 返回清理函数
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  /**
   * 向屏幕阅读器宣布消息
   * @param message - 要宣布的消息
   * @param priority - 优先级 ('polite' | 'assertive')
   */
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!import.meta.client || !message.trim()) return

    announcements.value.push(message)

    // 创建或更新 ARIA live region
    let liveRegion = document.getElementById(`aria-live-${priority}`)
    
    if (!liveRegion) {
      liveRegion = document.createElement('div')
      liveRegion.id = `aria-live-${priority}`
      liveRegion.setAttribute('aria-live', priority)
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.className = 'sr-only'
      document.body.appendChild(liveRegion)
    }

    // 清空后设置新消息（确保屏幕阅读器能够读取）
    liveRegion.textContent = ''
    setTimeout(() => {
      liveRegion!.textContent = message
    }, 100)

    // 清理旧消息
    setTimeout(() => {
      const index = announcements.value.indexOf(message)
      if (index > -1) {
        announcements.value.splice(index, 1)
      }
    }, 5000)
  }

  /**
   * 设置元素的 ARIA 属性
   * @param element - 目标元素
   * @param attributes - ARIA 属性对象
   */
  const setAriaAttributes = (element: HTMLElement, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = key.startsWith('aria-') ? key : `aria-${key}`
      element.setAttribute(ariaKey, value)
    })
  }

  /**
   * 创建可访问的按钮
   * @param element - 按钮元素
   * @param label - 按钮标签
   * @param description - 按钮描述（可选）
   */
  const makeButtonAccessible = (
    element: HTMLElement, 
    label: string, 
    description?: string
  ) => {
    element.setAttribute('role', 'button')
    element.setAttribute('aria-label', label)
    element.setAttribute('tabindex', '0')
    
    if (description) {
      const descId = `desc-${Math.random().toString(36).substr(2, 9)}`
      element.setAttribute('aria-describedby', descId)
      
      // 创建描述元素
      const descElement = document.createElement('span')
      descElement.id = descId
      descElement.className = 'sr-only'
      descElement.textContent = description
      element.appendChild(descElement)
    }

    // 添加键盘事件支持
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        element.click()
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown)
    }
  }

  /**
   * 处理键盘导航
   * @param event - 键盘事件
   * @param container - 容器元素
   */
  const handleKeyboardNavigation = (event: KeyboardEvent, container?: HTMLElement) => {
    const { key, ctrlKey, metaKey, shiftKey } = event

    // 更新可聚焦元素
    if (container) {
      updateFocusableElements(container)
    }

    switch (key) {
      case 'Tab':
        // Tab 导航由浏览器处理，但我们可以在这里添加自定义逻辑
        break
        
      case 'ArrowDown':
      case 'ArrowRight':
        if (!ctrlKey && !metaKey) {
          event.preventDefault()
          focusNext()
        }
        break
        
      case 'ArrowUp':
      case 'ArrowLeft':
        if (!ctrlKey && !metaKey) {
          event.preventDefault()
          focusPrevious()
        }
        break
        
      case 'Home':
        if (ctrlKey || metaKey) {
          event.preventDefault()
          focusFirst()
        }
        break
        
      case 'End':
        if (ctrlKey || metaKey) {
          event.preventDefault()
          focusLast()
        }
        break
        
      case 'Escape':
        // 可以用于关闭模态框等
        announce('已取消操作', 'polite')
        break
    }
  }

  /**
   * 初始化可访问性功能
   */
  const initAccessibility = () => {
    if (!import.meta.client) return

    detectScreenReader()
    updateFocusableElements()

    // 监听焦点变化
    const handleFocusChange = (event: FocusEvent) => {
      const target = event.target as HTMLElement
      const index = focusableElements.value.indexOf(target)
      if (index !== -1) {
        currentFocusIndex.value = index
      }
    }

    document.addEventListener('focusin', handleFocusChange)
    
    return () => {
      document.removeEventListener('focusin', handleFocusChange)
    }
  }

  // 生命周期
  onMounted(() => {
    initAccessibility()
  })

  return {
    focusableElements: readonly(focusableElements),
    currentFocusIndex: readonly(currentFocusIndex),
    announcements: readonly(announcements),
    isScreenReaderActive: readonly(isScreenReaderActive),
    updateFocusableElements,
    setFocus,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    createFocusTrap,
    announce,
    setAriaAttributes,
    makeButtonAccessible,
    handleKeyboardNavigation,
    detectScreenReader
  }
}
