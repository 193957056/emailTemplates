import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 全局测试设置

// Mock Nuxt composables
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $router: {
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn()
    }
  }),
  navigateTo: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  useRoute: () => ({
    path: '/',
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    name: undefined,
    redirectedFrom: undefined
  })
}))

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
})

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  value: {
    permission: 'default',
    requestPermission: vi.fn().mockResolvedValue('granted')
  }
})

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue('')
  }
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock document.execCommand
document.execCommand = vi.fn().mockReturnValue(true)
document.queryCommandState = vi.fn().mockReturnValue(false)
document.queryCommandValue = vi.fn().mockReturnValue('')

// Mock window.getSelection
window.getSelection = vi.fn().mockReturnValue({
  rangeCount: 0,
  getRangeAt: vi.fn(),
  removeAllRanges: vi.fn(),
  addRange: vi.fn()
})

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((html: string) => html),
    addHook: vi.fn(),
    removeHook: vi.fn(),
    removeAllHooks: vi.fn(),
    isValidAttribute: vi.fn().mockReturnValue(true)
  }
}))

// Mock JSZip
vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    file: vi.fn(),
    generateAsync: vi.fn().mockResolvedValue(new Blob())
  }))
}))

// 全局测试工具
config.global.mocks = {
  $t: (key: string) => key, // i18n mock
}

// 全局组件 stubs
config.global.stubs = {
  ClientOnly: {
    template: '<div><slot /></div>'
  },
  NuxtLink: {
    template: '<a><slot /></a>',
    props: ['to']
  }
}

// 测试工具函数
export const createMockElement = (tag: string = 'div', attributes: Record<string, any> = {}) => {
  const element = document.createElement(tag)
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
  return element
}

export const createMockEvent = (type: string, properties: Record<string, any> = {}) => {
  const event = new Event(type)
  Object.entries(properties).forEach(([key, value]) => {
    Object.defineProperty(event, key, { value, writable: true })
  })
  return event
}

export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))

export const mockConsole = () => {
  const originalConsole = { ...console }
  
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  return originalConsole
}
