import { ref, computed } from 'vue'

/**
 * 撤销/重做功能 composable
 * 提供操作历史管理和撤销重做功能
 */
export const useUndoRedo = <T = any>(initialState?: T) => {
  const history = ref<T[]>(initialState ? [initialState] : [])
  const currentIndex = ref(initialState ? 0 : -1)
  const maxHistorySize = ref(50) // 最大历史记录数量

  // 计算属性
  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < history.value.length - 1)
  const currentState = computed(() => {
    return currentIndex.value >= 0 ? history.value[currentIndex.value] : undefined
  })

  /**
   * 添加新状态到历史记录
   * @param state - 新状态
   * @param description - 操作描述
   */
  const pushState = (state: T, description?: string) => {
    // 如果当前不在历史记录的末尾，删除后面的记录
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    // 添加新状态
    history.value.push(state)
    currentIndex.value = history.value.length - 1

    // 限制历史记录大小
    if (history.value.length > maxHistorySize.value) {
      history.value = history.value.slice(-maxHistorySize.value)
      currentIndex.value = history.value.length - 1
    }

    console.log(`操作记录: ${description || '未知操作'} (${currentIndex.value + 1}/${history.value.length})`)
  }

  /**
   * 撤销操作
   * @returns 撤销后的状态
   */
  const undo = (): T | undefined => {
    if (!canUndo.value) {
      console.warn('无法撤销：已到达历史记录开始')
      return undefined
    }

    currentIndex.value--
    const state = history.value[currentIndex.value]
    console.log(`撤销操作 (${currentIndex.value + 1}/${history.value.length})`)
    return state
  }

  /**
   * 重做操作
   * @returns 重做后的状态
   */
  const redo = (): T | undefined => {
    if (!canRedo.value) {
      console.warn('无法重做：已到达历史记录末尾')
      return undefined
    }

    currentIndex.value++
    const state = history.value[currentIndex.value]
    console.log(`重做操作 (${currentIndex.value + 1}/${history.value.length})`)
    return state
  }

  /**
   * 跳转到指定历史记录
   * @param index - 目标索引
   * @returns 目标状态
   */
  const goToState = (index: number): T | undefined => {
    if (index < 0 || index >= history.value.length) {
      console.warn('无效的历史记录索引')
      return undefined
    }

    currentIndex.value = index
    const state = history.value[index]
    console.log(`跳转到历史记录 (${index + 1}/${history.value.length})`)
    return state
  }

  /**
   * 清空历史记录
   * @param keepCurrent - 是否保留当前状态
   */
  const clearHistory = (keepCurrent: boolean = true) => {
    if (keepCurrent && currentIndex.value >= 0) {
      const current = history.value[currentIndex.value]
      history.value = [current]
      currentIndex.value = 0
    } else {
      history.value = []
      currentIndex.value = -1
    }
    console.log('历史记录已清空')
  }

  /**
   * 获取历史记录信息
   * @returns 历史记录摘要
   */
  const getHistoryInfo = () => {
    return {
      total: history.value.length,
      current: currentIndex.value + 1,
      canUndo: canUndo.value,
      canRedo: canRedo.value,
      maxSize: maxHistorySize.value
    }
  }

  /**
   * 设置最大历史记录大小
   * @param size - 新的最大大小
   */
  const setMaxHistorySize = (size: number) => {
    maxHistorySize.value = Math.max(1, size)
    
    // 如果当前历史记录超过新的限制，进行裁剪
    if (history.value.length > maxHistorySize.value) {
      const startIndex = Math.max(0, currentIndex.value - maxHistorySize.value + 1)
      history.value = history.value.slice(startIndex, startIndex + maxHistorySize.value)
      currentIndex.value = Math.min(currentIndex.value - startIndex, maxHistorySize.value - 1)
    }
  }

  /**
   * 获取历史记录列表（用于调试或显示）
   * @returns 历史记录数组
   */
  const getHistory = () => {
    return history.value.map((state, index) => ({
      index,
      state,
      isCurrent: index === currentIndex.value
    }))
  }

  return {
    // 状态
    history: readonly(history),
    currentIndex: readonly(currentIndex),
    maxHistorySize: readonly(maxHistorySize),
    
    // 计算属性
    canUndo,
    canRedo,
    currentState,
    
    // 方法
    pushState,
    undo,
    redo,
    goToState,
    clearHistory,
    getHistoryInfo,
    setMaxHistorySize,
    getHistory
  }
}

/**
 * 专门用于富文本编辑器的撤销重做
 */
export const useEditorUndoRedo = () => {
  interface EditorState {
    title: string
    content: string
    timestamp: number
  }

  const undoRedo = useUndoRedo<EditorState>()
  
  /**
   * 保存编辑器状态
   * @param title - 标题
   * @param content - 内容
   * @param description - 操作描述
   */
  const saveEditorState = (title: string, content: string, description?: string) => {
    const state: EditorState = {
      title,
      content,
      timestamp: Date.now()
    }
    undoRedo.pushState(state, description)
  }

  /**
   * 撤销编辑器操作
   * @returns 撤销后的状态
   */
  const undoEditor = () => {
    return undoRedo.undo()
  }

  /**
   * 重做编辑器操作
   * @returns 重做后的状态
   */
  const redoEditor = () => {
    return undoRedo.redo()
  }

  /**
   * 检查状态是否发生变化
   * @param title - 当前标题
   * @param content - 当前内容
   * @returns 是否有变化
   */
  const hasChanges = (title: string, content: string): boolean => {
    const current = undoRedo.currentState.value
    if (!current) return true
    
    return current.title !== title || current.content !== content
  }

  /**
   * 获取状态差异
   * @param title - 当前标题
   * @param content - 当前内容
   * @returns 差异信息
   */
  const getStateDiff = (title: string, content: string) => {
    const current = undoRedo.currentState.value
    if (!current) return { titleChanged: true, contentChanged: true }
    
    return {
      titleChanged: current.title !== title,
      contentChanged: current.content !== content,
      timeSinceLastSave: Date.now() - current.timestamp
    }
  }

  return {
    // 继承基础功能
    ...undoRedo,
    
    // 编辑器特定方法
    saveEditorState,
    undoEditor,
    redoEditor,
    hasChanges,
    getStateDiff
  }
}
