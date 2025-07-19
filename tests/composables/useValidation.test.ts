import { describe, it, expect } from 'vitest'
import { useValidation } from '~/composables/useValidation'
import type { EmailTemplate } from '~/types/email'

describe('useValidation', () => {
  const { validateEmail, validateURL, validateTemplate, sanitizeString, validateColor } = useValidation()

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test.example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validateURL', () => {
    it('should validate correct URLs', () => {
      expect(validateURL('https://example.com')).toBe(true)
      expect(validateURL('http://localhost:3000')).toBe(true)
      expect(validateURL('ftp://files.example.com')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateURL('not-a-url')).toBe(false)
      expect(validateURL('http://')).toBe(false)
      expect(validateURL('')).toBe(false)
      expect(validateURL('javascript:alert("xss")')).toBe(false)
    })
  })

  describe('validateTemplate', () => {
    it('should validate a correct template', () => {
      const template: Partial<EmailTemplate> = {
        title: 'Test Template',
        content: 'This is test content for the email template.',
        name: 'test-template',
        category: 'work'
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should reject template with missing title', () => {
      const template: Partial<EmailTemplate> = {
        title: '',
        content: 'This is test content.',
        name: 'test-template',
        category: 'work'
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe('标题不能为空')
    })

    it('should reject template with title too long', () => {
      const template: Partial<EmailTemplate> = {
        title: 'a'.repeat(201),
        content: 'This is test content.',
        name: 'test-template',
        category: 'work'
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe('标题长度不能超过200字符')
    })

    it('should reject template with title too short', () => {
      const template: Partial<EmailTemplate> = {
        title: 'a',
        content: 'This is test content.',
        name: 'test-template',
        category: 'work'
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe('标题长度不能少于2字符')
    })

    it('should reject template with missing content', () => {
      const template: Partial<EmailTemplate> = {
        title: 'Test Template',
        content: '',
        name: 'test-template',
        category: 'work'
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors.content).toBe('内容不能为空')
    })

    it('should reject template with content too long', () => {
      const template: Partial<EmailTemplate> = {
        title: 'Test Template',
        content: 'a'.repeat(50001),
        name: 'test-template',
        category: 'work'
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors.content).toBe('内容长度不能超过50000字符')
    })

    it('should reject template with content too short', () => {
      const template: Partial<EmailTemplate> = {
        title: 'Test Template',
        content: 'short',
        name: 'test-template',
        category: 'work'
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors.content).toBe('内容长度不能少于10字符')
    })

    it('should reject template with missing name', () => {
      const template: Partial<EmailTemplate> = {
        title: 'Test Template',
        content: 'This is test content.',
        name: '',
        category: 'work'
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('模板名称不能为空')
    })

    it('should reject template with missing category', () => {
      const template: Partial<EmailTemplate> = {
        title: 'Test Template',
        content: 'This is test content.',
        name: 'test-template',
        category: ''
      }

      const result = validateTemplate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors.category).toBe('请选择模板分类')
    })
  })

  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      const input = 'Hello <script>alert("xss")</script> World'
      const result = sanitizeString(input)
      
      expect(result).toBe('Hello scriptalert(xss)/script World')
    })

    it('should trim whitespace', () => {
      const input = '  Hello World  '
      const result = sanitizeString(input)
      
      expect(result).toBe('Hello World')
    })

    it('should limit length when specified', () => {
      const input = 'This is a very long string that should be truncated'
      const result = sanitizeString(input, 20)
      
      expect(result).toBe('This is a very long ')
      expect(result.length).toBe(20)
    })

    it('should handle empty string', () => {
      const result = sanitizeString('')
      
      expect(result).toBe('')
    })
  })

  describe('validateColor', () => {
    it('should validate correct hex colors', () => {
      expect(validateColor('#FF0000')).toBe(true)
      expect(validateColor('#00ff00')).toBe(true)
      expect(validateColor('#ABC')).toBe(true)
      expect(validateColor('#123456')).toBe(true)
    })

    it('should reject invalid hex colors', () => {
      expect(validateColor('FF0000')).toBe(false) // missing #
      expect(validateColor('#GG0000')).toBe(false) // invalid characters
      expect(validateColor('#FF00')).toBe(false) // wrong length
      expect(validateColor('#FF00000')).toBe(false) // too long
      expect(validateColor('')).toBe(false)
      expect(validateColor('red')).toBe(false) // color name
    })
  })
})
