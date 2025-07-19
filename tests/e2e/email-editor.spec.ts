import { test, expect } from '@playwright/test'

test.describe('Email Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the email editor interface', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/邮件模板编辑器/)
    
    // 检查主要界面元素
    await expect(page.locator('h1')).toContainText('邮件模板编辑器')
    await expect(page.locator('[placeholder="请输入邮件标题"]')).toBeVisible()
    await expect(page.locator('[contenteditable="true"]')).toBeVisible()
  })

  test('should allow typing in title field', async ({ page }) => {
    const titleInput = page.locator('[placeholder="请输入邮件标题"]')
    
    await titleInput.fill('测试邮件标题')
    await expect(titleInput).toHaveValue('测试邮件标题')
  })

  test('should allow typing in content editor', async ({ page }) => {
    const contentEditor = page.locator('[contenteditable="true"]')
    
    await contentEditor.click()
    await contentEditor.fill('这是测试邮件内容')
    
    await expect(contentEditor).toContainText('这是测试邮件内容')
  })

  test('should show template list', async ({ page }) => {
    // 等待模板列表加载
    await page.waitForSelector('[data-testid="template-list"]', { timeout: 10000 })
    
    // 检查是否有模板项
    const templateItems = page.locator('[data-testid="template-item"]')
    await expect(templateItems.first()).toBeVisible()
  })

  test('should select template from list', async ({ page }) => {
    // 等待模板列表加载
    await page.waitForSelector('[data-testid="template-list"]', { timeout: 10000 })
    
    // 点击第一个模板
    const firstTemplate = page.locator('[data-testid="template-item"]').first()
    await firstTemplate.click()
    
    // 检查标题和内容是否已填充
    const titleInput = page.locator('[placeholder="请输入邮件标题"]')
    const contentEditor = page.locator('[contenteditable="true"]')
    
    await expect(titleInput).not.toHaveValue('')
    await expect(contentEditor).not.toBeEmpty()
  })

  test('should use rich text formatting tools', async ({ page }) => {
    const contentEditor = page.locator('[contenteditable="true"]')
    
    // 输入文本
    await contentEditor.click()
    await contentEditor.fill('测试文本')
    
    // 选择文本
    await contentEditor.selectText()
    
    // 点击加粗按钮
    const boldButton = page.locator('button[title*="加粗"]')
    await boldButton.click()
    
    // 检查文本是否被加粗
    await expect(contentEditor.locator('strong, b')).toContainText('测试文本')
  })

  test('should save content to local storage', async ({ page }) => {
    const titleInput = page.locator('[placeholder="请输入邮件标题"]')
    const contentEditor = page.locator('[contenteditable="true"]')
    const saveButton = page.locator('button:has-text("保存")')
    
    // 输入内容
    await titleInput.fill('测试标题')
    await contentEditor.click()
    await contentEditor.fill('测试内容')
    
    // 点击保存
    await saveButton.click()
    
    // 检查保存状态
    await expect(page.locator('text=保存成功')).toBeVisible({ timeout: 5000 })
  })

  test('should show preview modal', async ({ page }) => {
    const titleInput = page.locator('[placeholder="请输入邮件标题"]')
    const contentEditor = page.locator('[contenteditable="true"]')
    const previewButton = page.locator('button:has-text("预览")')
    
    // 输入内容
    await titleInput.fill('预览测试标题')
    await contentEditor.click()
    await contentEditor.fill('预览测试内容')
    
    // 点击预览
    await previewButton.click()
    
    // 检查预览模态框
    const previewModal = page.locator('[role="dialog"]')
    await expect(previewModal).toBeVisible()
    await expect(previewModal).toContainText('预览测试标题')
    await expect(previewModal).toContainText('预览测试内容')
    
    // 关闭预览
    const closeButton = previewModal.locator('button:has-text("×")')
    await closeButton.click()
    await expect(previewModal).not.toBeVisible()
  })

  test('should validate form inputs', async ({ page }) => {
    const saveButton = page.locator('button:has-text("保存")')
    
    // 尝试保存空表单
    await saveButton.click()
    
    // 检查验证错误消息
    await expect(page.locator('text=标题不能为空')).toBeVisible()
  })

  test('should work with keyboard shortcuts', async ({ page }) => {
    const titleInput = page.locator('[placeholder="请输入邮件标题"]')
    const contentEditor = page.locator('[contenteditable="true"]')
    
    // 输入内容
    await titleInput.fill('快捷键测试')
    await contentEditor.click()
    await contentEditor.fill('测试内容')
    
    // 使用 Ctrl+S 保存
    await page.keyboard.press('Control+s')
    
    // 检查保存状态
    await expect(page.locator('text=保存成功')).toBeVisible({ timeout: 5000 })
  })

  test('should be responsive on mobile', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 检查移动端布局
    const mobileMenuButton = page.locator('button[aria-label="切换模板列表"]')
    await expect(mobileMenuButton).toBeVisible()
    
    // 点击菜单按钮
    await mobileMenuButton.click()
    
    // 检查模板列表是否显示
    const templateList = page.locator('[data-testid="template-list"]')
    await expect(templateList).toBeVisible()
    
    // 关闭菜单
    const closeButton = page.locator('button[aria-label="关闭模板列表"]')
    await closeButton.click()
    await expect(templateList).not.toBeVisible()
  })

  test('should handle accessibility features', async ({ page }) => {
    // 检查 ARIA 标签
    const contentEditor = page.locator('[contenteditable="true"]')
    await expect(contentEditor).toHaveAttribute('aria-label', '邮件内容编辑器')
    await expect(contentEditor).toHaveAttribute('role', 'textbox')
    
    // 测试键盘导航
    await page.keyboard.press('Tab')
    await expect(page.locator('[placeholder="请输入邮件标题"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(contentEditor).toBeFocused()
  })

  test('should persist data across page reloads', async ({ page }) => {
    const titleInput = page.locator('[placeholder="请输入邮件标题"]')
    const contentEditor = page.locator('[contenteditable="true"]')
    
    // 输入内容
    await titleInput.fill('持久化测试标题')
    await contentEditor.click()
    await contentEditor.fill('持久化测试内容')
    
    // 保存
    await page.locator('button:has-text("保存")').click()
    await expect(page.locator('text=保存成功')).toBeVisible({ timeout: 5000 })
    
    // 刷新页面
    await page.reload()
    
    // 检查内容是否恢复
    await expect(titleInput).toHaveValue('持久化测试标题')
    await expect(contentEditor).toContainText('持久化测试内容')
  })
})
