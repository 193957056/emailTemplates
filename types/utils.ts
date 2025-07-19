/**
 * 工具类型定义
 * 提供通用的 TypeScript 工具类型
 */

// 基础工具类型
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined

// 深度只读
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 深度可选
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 深度必需
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// 排除指定键
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// 选择指定键
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// 条件类型
export type If<C extends boolean, T, F> = C extends true ? T : F

// 数组元素类型
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

// 对象值类型
export type ValueOf<T> = T[keyof T]

// 函数参数类型
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never

// 函数返回类型
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

// Promise 解包类型
export type Awaited<T> = T extends Promise<infer U> ? U : T

// 字符串字面量类型
export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never

// 数字字面量类型
export type NumberLiteral<T> = T extends number ? (number extends T ? never : T) : number

// 布尔字面量类型
export type BooleanLiteral<T> = T extends boolean ? (boolean extends T ? never : T) : boolean

// 联合类型转交叉类型
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

// 获取联合类型的最后一个类型
export type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never

// 联合类型转元组
export type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : [...UnionToTuple<Exclude<T, L>>, L]

// 字符串操作类型
export type Uppercase<S extends string> = intrinsic
export type Lowercase<S extends string> = intrinsic
export type Capitalize<S extends string> = intrinsic
export type Uncapitalize<S extends string> = intrinsic

// 模板字面量类型
export type Join<T extends readonly string[], D extends string = ','> = T extends readonly [
  infer F,
  ...infer R
]
  ? F extends string
  ? R extends readonly string[]
  ? R['length'] extends 0
  ? F
  : `${F}${D}${Join<R, D>}`
  : never
  : never
  : ''

// 分割字符串类型
export type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S]

// 替换字符串类型
export type Replace<S extends string, From extends string, To extends string> = S extends `${infer L}${From}${infer R}`
  ? `${L}${To}${R}`
  : S

// 对象路径类型
export type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, any>
  ? `${K}` | `${K}.${Path<T[K]>}`
  : `${K}`
  : never

// 根据路径获取值类型
export type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
  ? Rest extends Path<T[K]>
  ? PathValue<T[K], Rest>
  : never
  : never
  : P extends keyof T
  ? T[P]
  : never

// 事件处理器类型
export type EventHandler<T = Event> = (event: T) => void
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

// 分页类型
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

// 排序类型
export type SortOrder = 'asc' | 'desc'

export interface SortConfig<T = any> {
  field: keyof T
  order: SortOrder
}

// 过滤类型
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'regex'

export interface FilterConfig<T = any> {
  field: keyof T
  operator: FilterOperator
  value: any
}

// 查询类型
export interface QueryConfig<T = any> {
  filters?: FilterConfig<T>[]
  sort?: SortConfig<T>[]
  pagination?: Partial<Pagination>
  search?: string
}

// 表单类型
export type FormField<T> = {
  [K in keyof T]: {
    value: T[K]
    error?: string
    touched?: boolean
    dirty?: boolean
  }
}

export interface FormState<T> {
  fields: FormField<T>
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}

// 状态管理类型
export type ActionType = string
export type Action<T = any> = {
  type: ActionType
  payload?: T
}

export type Reducer<S, A extends Action = Action> = (state: S, action: A) => S

// 异步状态类型
export interface AsyncState<T = any, E = Error> {
  data?: T
  loading: boolean
  error?: E
  lastUpdated?: Date
}

// 缓存类型
export interface CacheItem<T = any> {
  data: T
  timestamp: number
  ttl?: number
}

export interface CacheConfig {
  ttl?: number
  maxSize?: number
  strategy?: 'lru' | 'fifo' | 'lfu'
}

// 主题类型
export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
  mode: ThemeMode
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: number
}

// 国际化类型
export type LocaleCode = string
export type TranslationKey = string
export type TranslationValue = string | number | boolean

export interface Translation {
  [key: TranslationKey]: TranslationValue | Translation
}

export interface LocaleConfig {
  code: LocaleCode
  name: string
  nativeName: string
  translations: Translation
}

// 权限类型
export type Permission = string
export type Role = string

export interface User {
  id: string
  name: string
  email: string
  roles: Role[]
  permissions: Permission[]
}

// 日志类型
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
}

// 配置类型
export interface AppConfig {
  apiUrl: string
  version: string
  environment: 'development' | 'staging' | 'production'
  features: Record<string, boolean>
  limits: Record<string, number>
}

// 元数据类型
export interface Metadata {
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
  version?: number
  tags?: string[]
}

// 实体基类型
export interface BaseEntity {
  id: string
  metadata: Metadata
}

// 可搜索类型
export interface Searchable {
  searchableFields: string[]
  searchIndex?: string
}

// 可排序类型
export interface Sortable {
  sortableFields: string[]
  defaultSort?: SortConfig
}

// 可过滤类型
export interface Filterable {
  filterableFields: string[]
  defaultFilters?: FilterConfig[]
}
