import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSafeHTML } from '~/composables/useSafeHTML'
import DOMPurify from 'dompurify'

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn()
  }
}))

describe('useSafeHTML', () => {
  const mockSanitize = vi.mocked(DOMPurify.sanitize)
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sanitizeHTML', () => {
    it('should sanitize HTML content', () => {
      const { sanitizeHTML } = useSafeHTML()
      const input = '<script>alert("xss")</script><p>Hello</p>'
      const expected = '<p>Hello</p>'
      
      mockSanitize.mockReturnValue(expected)
      
      const result = sanitizeHTML(input)
      
      expect(mockSanitize).toHaveBeenCalledWith(input, expect.objectContaining({
        ALLOWED_TAGS: expect.arrayContaining(['p', 'div', 'span', 'strong', 'em']),
        ALLOWED_ATTR: expect.arrayContaining(['style', 'class']),
        ALLOW_DATA_ATTR: false
      }))
      expect(result).toBe(expected)
    })

    it('should return empty string for empty input', () => {
      const { sanitizeHTML } = useSafeHTML()
      
      const result = sanitizeHTML('')
      
      expect(result).toBe('')
      expect(mockSanitize).not.toHaveBeenCalled()
    })

    it('should handle null and undefined input', () => {
      const { sanitizeHTML } = useSafeHTML()
      
      expect(sanitizeHTML(null as any)).toBe('')
      expect(sanitizeHTML(undefined as any)).toBe('')
    })
  })

  describe('stripHTML', () => {
    it('should remove all HTML tags', () => {
      const { stripHTML } = useSafeHTML()
      const input = '<p>Hello <strong>World</strong></p>'
      const expected = 'Hello World'
      
      mockSanitize.mockReturnValue(expected)
      
      const result = stripHTML(input)
      
      expect(mockSanitize).toHaveBeenCalledWith(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
      })
      expect(result).toBe(expected)
    })

    it('should return empty string for empty input', () => {
      const { stripHTML } = useSafeHTML()
      
      const result = stripHTML('')
      
      expect(result).toBe('')
      expect(mockSanitize).not.toHaveBeenCalled()
    })
  })

  describe('isHTMLSafe', () => {
    it('should return true for safe HTML', () => {
      const { isHTMLSafe } = useSafeHTML()
      const safeHTML = '<p>Hello World</p>'
      
      mockSanitize.mockReturnValue(safeHTML)
      
      const result = isHTMLSafe(safeHTML)
      
      expect(result).toBe(true)
    })

    it('should return false for unsafe HTML', () => {
      const { isHTMLSafe } = useSafeHTML()
      const unsafeHTML = '<script>alert("xss")</script><p>Hello</p>'
      const sanitizedHTML = '<p>Hello</p>'
      
      mockSanitize.mockReturnValue(sanitizedHTML)
      
      const result = isHTMLSafe(unsafeHTML)
      
      expect(result).toBe(false)
    })

    it('should return true for empty input', () => {
      const { isHTMLSafe } = useSafeHTML()
      
      const result = isHTMLSafe('')
      
      expect(result).toBe(true)
    })
  })

  describe('getHTMLSummary', () => {
    it('should return summary of HTML content', () => {
      const { getHTMLSummary } = useSafeHTML()
      const html = '<p>This is a long paragraph with lots of content</p>'
      const plainText = 'This is a long paragraph with lots of content'
      
      mockSanitize.mockReturnValue(plainText)
      
      const result = getHTMLSummary(html, 20)
      
      expect(mockSanitize).toHaveBeenCalledWith(html, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
      })
      expect(result).toBe('This is a long parag...')
    })

    it('should return full text if shorter than max length', () => {
      const { getHTMLSummary } = useSafeHTML()
      const html = '<p>Short text</p>'
      const plainText = 'Short text'
      
      mockSanitize.mockReturnValue(plainText)
      
      const result = getHTMLSummary(html, 150)
      
      expect(result).toBe(plainText)
    })

    it('should use default max length of 150', () => {
      const { getHTMLSummary } = useSafeHTML()
      const html = '<p>Text</p>'
      const plainText = 'Text'
      
      mockSanitize.mockReturnValue(plainText)
      
      const result = getHTMLSummary(html)
      
      expect(result).toBe(plainText)
    })
  })
})
