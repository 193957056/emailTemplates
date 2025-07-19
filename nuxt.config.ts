// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // 模块配置
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // 性能优化配置
  experimental: {
    payloadExtraction: false, // 减少 payload 大小
    inlineSSRStyles: false,   // 避免内联样式导致的 FOUC
    viewTransition: true,     // 启用视图过渡动画
  },

  // 构建优化
  build: {
    transpile: ['jszip', 'dompurify'], // 确保第三方库正确转译
  },

  // Vite 配置
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 代码分割
            'editor': ['./components/EmailEditor.vue'],
            'utils': ['./utils/exportUtils.ts', './utils/dateUtils.ts'],
            'vendor': ['jszip', 'dompurify']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['jszip', 'dompurify']
    }
  },

  // CSS 优化
  css: [
    '@/assets/css/main.css'
  ],

  // 预渲染配置
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    },
    compressPublicAssets: true, // 压缩静态资源
  },

  // SEO 和 PWA 优化
  app: {
    head: {
      title: '邮件模板编辑器 - 专业的富文本邮件编辑工具',
      titleTemplate: '%s | 邮件模板编辑器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '专业的邮件模板编辑器，支持富文本编辑、模板管理、响应式预览和多语言翻译。快速创建美观的邮件内容。'
        },
        {
          name: 'keywords',
          content: '邮件模板,富文本编辑器,HTML编辑器,邮件编辑,模板管理,响应式设计'
        },
        { name: 'author', content: '邮件模板编辑器团队' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '邮件模板编辑器 - 专业的富文本邮件编辑工具' },
        {
          property: 'og:description',
          content: '专业的邮件模板编辑器，支持富文本编辑、模板管理、响应式预览和多语言翻译。'
        },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: 'https://your-domain.com' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '邮件模板编辑器' },
        {
          name: 'twitter:description',
          content: '专业的邮件模板编辑器，支持富文本编辑、模板管理、响应式预览。'
        },
        { name: 'twitter:image', content: '/twitter-image.png' },

        // 移动端优化
        { name: 'theme-color', content: '#3B82F6' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: '邮件编辑器' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
          crossorigin: 'anonymous',
          integrity: 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=='
        }
      ]
    }
  },

  // 开发服务器配置
  devServer: {
    port: 3003,
    host: '0.0.0.0' // 允许外部访问
  },

  // 运行时配置
  runtimeConfig: {
    // 私有配置（仅服务端可用）
    apiSecret: '123',

    // 公共配置（客户端也可用）
    public: {
      apiBase: '/api',
      appVersion: '1.0.0',
      buildTime: new Date().toISOString()
    }
  },

  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: false // 临时禁用，等 Node.js 升级后再启用
  }
})