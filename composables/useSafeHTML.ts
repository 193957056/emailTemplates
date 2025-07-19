import DOMPurify from 'dompurify'

/**
 * 安全的 HTML 处理 composable
 * 用于防止 XSS 攻击，过滤用户输入的 HTML 内容
 */
export const useSafeHTML = () => {
  /**
   * 清理 HTML 内容，移除潜在的恶意脚本
   * @param html - 需要清理的 HTML 字符串
   * @returns 清理后的安全 HTML 字符串
   */
  const sanitizeHTML = (html: string): string => {
    if (!html) return ''
    
    return DOMPurify.sanitize(html, {
      // 允许的 HTML 标签
      ALLOWED_TAGS: [
        'p', 'div', 'span', 'strong', 'em', 'u', 'br', 'ul', 'ol', 'li', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 
        'thead', 'tbody', 'a', 'img', 'hr'
      ],
      
      // 允许的属性
      ALLOWED_ATTR: [
        'style', 'class', 'href', 'target', 'src', 'alt', 'title',
        'colspan', 'rowspan', 'border', 'cellpadding', 'cellspacing'
      ],
      
      // 不允许 data 属性
      ALLOW_DATA_ATTR: false,
      
      // 不允许未知协议
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      
      // 保持相对 URL
      KEEP_CONTENT: true,
      
      // 返回 DOM 节点而不是字符串（用于更好的性能）
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      
      // 移除空属性
      SANITIZE_DOM: true
    })
  }

  /**
   * 清理纯文本内容，移除所有 HTML 标签
   * @param html - 包含 HTML 的字符串
   * @returns 纯文本字符串
   */
  const stripHTML = (html: string): string => {
    if (!html) return ''
    
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    })
  }

  /**
   * 验证 HTML 内容是否安全
   * @param html - 需要验证的 HTML 字符串
   * @returns 是否安全
   */
  const isHTMLSafe = (html: string): boolean => {
    if (!html) return true
    
    const cleaned = sanitizeHTML(html)
    return cleaned === html
  }

  /**
   * 获取 HTML 内容的摘要（纯文本，限制长度）
   * @param html - HTML 字符串
   * @param maxLength - 最大长度，默认 150
   * @returns 摘要文本
   */
  const getHTMLSummary = (html: string, maxLength: number = 150): string => {
    const text = stripHTML(html)
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return {
    sanitizeHTML,
    stripHTML,
    isHTMLSafe,
    getHTMLSummary
  }
}
