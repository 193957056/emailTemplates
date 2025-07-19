import type { Language } from '~/types/email'

// 支持的语言列表
export const supportedLanguages: Language[] = [
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
]

// 获取语言名称
export function getLanguageName(code: string): string {
    const language = supportedLanguages.find(lang => lang.code === code)
    return language ? language.nativeName : code
}

// 检测语言是否是从右到左的书写方向
export function isRTL(code: string): boolean {
    return ['ar', 'he', 'fa', 'ur'].includes(code)
}

// 根据内容猜测语言
export function detectLanguage(text: string): string {
    // 简单的语言检测逻辑
    // 这里只是一个示例，实际应用中可能需要更复杂的算法或使用第三方库

    // 检测中文
    if (/[\u4e00-\u9fa5]/.test(text)) {
        return 'zh-CN'
    }

    // 检测日文
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
        return 'ja'
    }

    // 检测韩文
    if (/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/.test(text)) {
        return 'ko'
    }

    // 检测俄文
    if (/[\u0400-\u04FF]/.test(text)) {
        return 'ru'
    }

    // 检测阿拉伯文
    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) {
        return 'ar'
    }

    // 默认返回英文
    return 'en'
}

// 获取常见邮件问候语
export function getGreeting(languageCode: string, recipientName?: string): string {
    const greetings: Record<string, string> = {
        'zh-CN': recipientName ? `尊敬的${recipientName}：` : '尊敬的用户：',
        'en': recipientName ? `Dear ${recipientName},` : 'Dear User,',
        'ja': recipientName ? `${recipientName}様、` : 'お客様、',
        'ko': recipientName ? `${recipientName}님께,` : '사용자님께,',
        'fr': recipientName ? `Cher ${recipientName},` : 'Cher utilisateur,',
        'de': recipientName ? `Sehr geehrte(r) ${recipientName},` : 'Sehr geehrter Benutzer,',
        'es': recipientName ? `Estimado/a ${recipientName}:` : 'Estimado/a usuario/a:',
        'pt': recipientName ? `Prezado(a) ${recipientName},` : 'Prezado(a) usuário(a),',
        'it': recipientName ? `Gentile ${recipientName},` : 'Gentile utente,',
        'ru': recipientName ? `Уважаемый(ая) ${recipientName},` : 'Уважаемый пользователь,',
        'ar': recipientName ? `عزيزي ${recipientName}،` : 'عزيزي المستخدم،',
        'hi': recipientName ? `प्रिय ${recipientName},` : 'प्रिय उपयोगकर्ता,',
        'th': recipientName ? `เรียน ${recipientName},` : 'เรียนผู้ใช้,',
        'vi': recipientName ? `Kính gửi ${recipientName},` : 'Kính gửi người dùng,',
    }

    return greetings[languageCode] || greetings['en']
} 