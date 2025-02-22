# 邮件模板编辑器 ✉️

一个优雅的邮件模板编辑器，帮助你快速编写和管理邮件内容。基于 Nuxt 3 构建，支持富文本编辑、模板管理和一键复制。

## ✨ 特性

- 📝 富文本编辑 - 支持文字格式化、对齐方式调整
- 🎨 文字颜色 - 内置多种预设颜色，支持自定义颜色
- 💾 模板管理 - 预设多种邮件模板，一键套用
- 📋 智能复制 - 支持复制全文/仅标题/仅内容，保留文字格式
- 🌈 界面优雅 - 简洁直观的用户界面，流畅的交互体验

## 🚀 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- pnpm 8.x 或更高版本

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

## 📦 部署指南

### 1. 构建项目

```bash
pnpm build
```

### 2. 上传到服务器

使用 scp 命令上传必要文件：

```bash
# 创建远程目录（如果需要）
ssh user@your-server "mkdir -p /path/to/app"

# 上传构建文件和配置
scp -r .output ecosystem.config.cjs user@your-server:/path/to/app/
```

替换以下内容：
- `user`: 你的服务器用户名
- `your-server`: 你的服务器地址
- `/path/to/app/`: 服务器上的目标目录

### 3. 创建 PM2 配置文件

创建 `ecosystem.config.cjs`：

```javascript
module.exports = {
  apps: [{
    name: 'email-editor',
    script: '.output/server/index.mjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3003,        // 指定运行端口
      HOST: '0.0.0.0'    // 允许外部访问
    }
  }]
}
```

### 4. 使用 PM2 启动应用

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start ecosystem.config.cjs

# 其他常用命令
pm2 list            # 查看应用列表
pm2 restart         # 重启应用
pm2 stop           # 停止应用
pm2 logs           # 查看日志
```

注意事项：
- 修改端口需要在 `ecosystem.config.cjs` 中更改 `PORT` 值
- 修改配置后需要重启应用：`pm2 restart email-editor`
- 确保端口未被其他服务占用
- 可以使用 `pm2 logs` 查看运行日志

## 🎯 使用技巧

1. 💡 使用快捷键：
   - `Ctrl + B` - 加粗
   - `Ctrl + I` - 斜体
   - `Ctrl + U` - 下划线

2. 🎨 颜色选择：
   - 使用预设颜色快速应用
   - 通过颜色选择器自定义颜色
   - 支持 RGB 值精确调整

3. 📋 复制功能：
   - 可选择复制范围
   - 自动保留文字格式
   - 支持富文本粘贴

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交改动：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 🙏 鸣谢

- [Nuxt.js](https://nuxt.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)

---

Made with ❤️ by yama
