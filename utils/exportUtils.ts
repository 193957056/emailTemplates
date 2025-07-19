import type { EmailTemplate } from '~/types/email'

/**
 * 将邮件模板导出为HTML文件
 * @param template 要导出的邮件模板
 */
export function exportTemplateAsHtml(template: EmailTemplate): void {
    // 创建完整的HTML文档
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .template-header {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eaeaea;
        }
        .template-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .template-meta {
            font-size: 14px;
            color: #666;
        }
        .template-category {
            display: inline-block;
            background-color: #e6f7ff;
            color: #0066cc;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 10px;
        }
        .template-content {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="template-header">
        <div class="template-title">${template.title}</div>
        <div class="template-meta">
            模板名称: ${template.name}
            <span class="template-category">${template.category}</span>
        </div>
    </div>
    
    <div class="template-content">
        ${template.content}
    </div>
</body>
</html>
  `.trim()

    // 创建Blob对象
    const blob = new Blob([htmlContent], { type: 'text/html' })

    // 创建下载链接
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = `${template.name}.html`

    // 模拟点击链接触发下载
    document.body.appendChild(downloadLink)
    downloadLink.click()

    // 清理
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(downloadLink.href)
}

/**
 * 将多个邮件模板导出为ZIP文件
 * @param templates 要导出的邮件模板列表
 */
export async function exportTemplatesAsZip(templates: EmailTemplate[]): Promise<void> {
    try {
        // 动态导入JSZip库
        const JSZip = (await import('jszip')).default

        // 创建新的ZIP文件
        const zip = new JSZip()

        // 将每个模板添加到ZIP中
        templates.forEach(template => {
            const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .template-header {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eaeaea;
        }
        .template-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .template-meta {
            font-size: 14px;
            color: #666;
        }
        .template-category {
            display: inline-block;
            background-color: #e6f7ff;
            color: #0066cc;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 10px;
        }
        .template-content {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="template-header">
        <div class="template-title">${template.title}</div>
        <div class="template-meta">
            模板名称: ${template.name}
            <span class="template-category">${template.category}</span>
        </div>
    </div>
    
    <div class="template-content">
        ${template.content}
    </div>
</body>
</html>
      `.trim()

            // 添加到ZIP文件中
            zip.file(`${template.name}.html`, htmlContent)
        })

        // 生成ZIP文件
        const content = await zip.generateAsync({ type: 'blob' })

        // 创建下载链接
        const downloadLink = document.createElement('a')
        downloadLink.href = URL.createObjectURL(content)
        downloadLink.download = `email_templates_${new Date().toISOString().slice(0, 10)}.zip`

        // 模拟点击链接触发下载
        document.body.appendChild(downloadLink)
        downloadLink.click()

        // 清理
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(downloadLink.href)
    } catch (error) {
        console.error('导出模板失败:', error)
        alert('导出失败，请稍后重试')
    }
} 