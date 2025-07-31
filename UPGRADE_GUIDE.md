# 邮件模板编辑器升级指南

## 🚨 紧急修复：Node.js 版本不兼容

### 问题描述
当前项目使用 Node.js v14.21.3，但 Nuxt 3 需要 Node.js 18+ 版本。

### 错误信息
```
SyntaxError: Unexpected token '||='
```

## 升级步骤

### 1. 安装 Node.js 18+（必需）

```bash
# 使用 nvm 管理 Node.js 版本（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

nvm install 18.19.0
nvm use 18.19.0
nvm alias default 18.19.0

# 或者直接从官网下载安装
# https://nodejs.org/
```

### 2. 验证版本

```bash
node --version  # 应该显示 v18.19.0 或更高
npm --version   # 应该显示 9.0.0 或更高
```

### 3. 清理并重新安装依赖

```bash
# 删除旧的依赖和缓存
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml
rm -rf .nuxt .output

# 重新安装依赖
npm install

# 或者使用 pnpm（更快）
# pnpm install
```

### 4. 验证项目运行

```bash
# 启动开发服务器
npm run dev

# 或者使用 pnpm
# pnpm dev
```

### 5. 运行测试验证

```bash
# 运行类型检查
npm run type-check

# 运行代码检查
npm run lint

# 运行单元测试
npm run test:run

# 运行 E2E 测试
npm run test:e2e
```

## 兼容性说明

- Node.js 18+ 支持 `||=` 操作符
- 锁定了具体的依赖版本以确保稳定性
- 添加了 engines 字段限制最低版本要求

## 🔧 故障排除

### 常见问题

#### 1. Node.js 版本问题
```bash
# 检查当前版本
node --version

# 如果版本低于 18，请升级
nvm install 18
nvm use 18
```

#### 2. 依赖安装失败
```bash
# 清理缓存
npm cache clean --force
# 或者 pnpm store prune

# 删除 node_modules 重新安装
rm -rf node_modules
npm install
```

#### 3. TypeScript 错误
```bash
# 运行类型检查
npm run type-check

# 如果有错误，检查 tsconfig.json 配置
```

#### 4. 启动失败
```bash
# 检查端口是否被占用
lsof -i :3003

# 使用不同端口启动
PORT=3004 npm run dev
```

## 🚀 升级后的新功能

升级完成后，您将获得：

### 已实现的功能
- ✅ 现代化的 Nuxt 3 框架
- ✅ Vue 3 Composition API
- ✅ TypeScript 严格模式
- ✅ 安全的 HTML 处理（XSS 防护）
- ✅ 完整的可访问性支持
- ✅ 撤销/重做功能
- ✅ 自动保存
- ✅ 键盘快捷键
- ✅ 响应式设计
- ✅ 单元测试和 E2E 测试
- ✅ CI/CD 流水线

### 性能提升
- 🚀 更快的构建速度
- 🚀 更好的开发体验
- 🚀 更小的包体积
- 🚀 更好的 SEO 支持

## 📞 获取帮助

如果在升级过程中遇到问题：

1. 检查 [Node.js 官方文档](https://nodejs.org/en/docs/)
2. 查看 [Nuxt 3 升级指南](https://nuxt.com/docs/getting-started/upgrade)
3. 查看项目的 GitHub Issues
4. 联系开发团队
