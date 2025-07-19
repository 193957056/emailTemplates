import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUndoRedo, useEditorUndoRedo } from '~/composables/useUndoRedo'

describe('useUndoRedo', () => {
  describe('basic functionality', () => {
    it('should initialize with empty history', () => {
      const { history, currentIndex, canUndo, canRedo } = useUndoRedo()
      
      expect(history.value).toEqual([])
      expect(currentIndex.value).toBe(-1)
      expect(canUndo.value).toBe(false)
      expect(canRedo.value).toBe(false)
    })

    it('should initialize with initial state', () => {
      const initialState = { value: 'initial' }
      const { history, currentIndex, canUndo, canRedo, currentState } = useUndoRedo(initialState)
      
      expect(history.value).toEqual([initialState])
      expect(currentIndex.value).toBe(0)
      expect(currentState.value).toEqual(initialState)
      expect(canUndo.value).toBe(false)
      expect(canRedo.value).toBe(false)
    })
  })

  describe('pushState', () => {
    it('should add new state to history', () => {
      const { pushState, history, currentIndex, canUndo } = useUndoRedo()
      const state1 = { value: 'state1' }
      const state2 = { value: 'state2' }
      
      pushState(state1)
      expect(history.value).toEqual([state1])
      expect(currentIndex.value).toBe(0)
      expect(canUndo.value).toBe(false)
      
      pushState(state2)
      expect(history.value).toEqual([state1, state2])
      expect(currentIndex.value).toBe(1)
      expect(canUndo.value).toBe(true)
    })

    it('should remove future states when pushing from middle of history', () => {
      const { pushState, undo, history, currentIndex } = useUndoRedo()
      const state1 = { value: 'state1' }
      const state2 = { value: 'state2' }
      const state3 = { value: 'state3' }
      const newState = { value: 'newState' }
      
      pushState(state1)
      pushState(state2)
      pushState(state3)
      
      undo() // Go back to state2
      pushState(newState) // This should remove state3
      
      expect(history.value).toEqual([state1, state2, newState])
      expect(currentIndex.value).toBe(2)
    })

    it('should limit history size', () => {
      const { pushState, history, setMaxHistorySize } = useUndoRedo()
      
      setMaxHistorySize(3)
      
      for (let i = 0; i < 5; i++) {
        pushState({ value: `state${i}` })
      }
      
      expect(history.value.length).toBe(3)
      expect(history.value[0]).toEqual({ value: 'state2' })
      expect(history.value[2]).toEqual({ value: 'state4' })
    })
  })

  describe('undo and redo', () => {
    it('should undo to previous state', () => {
      const { pushState, undo, currentState, canUndo, canRedo } = useUndoRedo()
      const state1 = { value: 'state1' }
      const state2 = { value: 'state2' }
      
      pushState(state1)
      pushState(state2)
      
      const undoResult = undo()
      
      expect(undoResult).toEqual(state1)
      expect(currentState.value).toEqual(state1)
      expect(canUndo.value).toBe(false)
      expect(canRedo.value).toBe(true)
    })

    it('should redo to next state', () => {
      const { pushState, undo, redo, currentState, canUndo, canRedo } = useUndoRedo()
      const state1 = { value: 'state1' }
      const state2 = { value: 'state2' }
      
      pushState(state1)
      pushState(state2)
      undo()
      
      const redoResult = redo()
      
      expect(redoResult).toEqual(state2)
      expect(currentState.value).toEqual(state2)
      expect(canUndo.value).toBe(true)
      expect(canRedo.value).toBe(false)
    })

    it('should not undo when at beginning', () => {
      const { pushState, undo, currentState } = useUndoRedo()
      const state1 = { value: 'state1' }
      
      pushState(state1)
      
      const undoResult = undo()
      
      expect(undoResult).toBeUndefined()
      expect(currentState.value).toEqual(state1)
    })

    it('should not redo when at end', () => {
      const { pushState, redo, currentState } = useUndoRedo()
      const state1 = { value: 'state1' }
      
      pushState(state1)
      
      const redoResult = redo()
      
      expect(redoResult).toBeUndefined()
      expect(currentState.value).toEqual(state1)
    })
  })

  describe('goToState', () => {
    it('should jump to specific state', () => {
      const { pushState, goToState, currentState, currentIndex } = useUndoRedo()
      const states = [
        { value: 'state1' },
        { value: 'state2' },
        { value: 'state3' }
      ]
      
      states.forEach(state => pushState(state))
      
      const result = goToState(0)
      
      expect(result).toEqual(states[0])
      expect(currentState.value).toEqual(states[0])
      expect(currentIndex.value).toBe(0)
    })

    it('should return undefined for invalid index', () => {
      const { pushState, goToState } = useUndoRedo()
      
      pushState({ value: 'state1' })
      
      expect(goToState(-1)).toBeUndefined()
      expect(goToState(5)).toBeUndefined()
    })
  })

  describe('clearHistory', () => {
    it('should clear all history', () => {
      const { pushState, clearHistory, history, currentIndex } = useUndoRedo()
      
      pushState({ value: 'state1' })
      pushState({ value: 'state2' })
      
      clearHistory(false)
      
      expect(history.value).toEqual([])
      expect(currentIndex.value).toBe(-1)
    })

    it('should keep current state when specified', () => {
      const { pushState, clearHistory, history, currentIndex, currentState } = useUndoRedo()
      const state1 = { value: 'state1' }
      const state2 = { value: 'state2' }
      
      pushState(state1)
      pushState(state2)
      
      clearHistory(true)
      
      expect(history.value).toEqual([state2])
      expect(currentIndex.value).toBe(0)
      expect(currentState.value).toEqual(state2)
    })
  })
})

describe('useEditorUndoRedo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should save editor state with timestamp', () => {
    const { saveEditorState, currentState } = useEditorUndoRedo()
    const title = 'Test Title'
    const content = 'Test Content'
    
    saveEditorState(title, content, 'Initial state')
    
    expect(currentState.value).toMatchObject({
      title,
      content,
      timestamp: expect.any(Number)
    })
  })

  it('should detect changes in editor state', () => {
    const { saveEditorState, hasChanges } = useEditorUndoRedo()
    
    saveEditorState('Title 1', 'Content 1')
    
    expect(hasChanges('Title 1', 'Content 1')).toBe(false)
    expect(hasChanges('Title 2', 'Content 1')).toBe(true)
    expect(hasChanges('Title 1', 'Content 2')).toBe(true)
  })

  it('should provide state diff information', () => {
    const { saveEditorState, getStateDiff } = useEditorUndoRedo()
    
    saveEditorState('Title 1', 'Content 1')
    
    const diff = getStateDiff('Title 2', 'Content 2')
    
    expect(diff.titleChanged).toBe(true)
    expect(diff.contentChanged).toBe(true)
    expect(diff.timeSinceLastSave).toBeGreaterThanOrEqual(0)
  })

  it('should handle undo and redo operations', () => {
    const { saveEditorState, undoEditor, redoEditor } = useEditorUndoRedo()
    
    saveEditorState('Title 1', 'Content 1')
    saveEditorState('Title 2', 'Content 2')
    
    const undoResult = undoEditor()
    expect(undoResult).toMatchObject({
      title: 'Title 1',
      content: 'Content 1'
    })
    
    const redoResult = redoEditor()
    expect(redoResult).toMatchObject({
      title: 'Title 2',
      content: 'Content 2'
    })
  })
})
