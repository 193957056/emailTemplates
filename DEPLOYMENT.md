# 🚀 Nuxt3 邮件模板项目部署指南

本项目使用 Makefile + PM2 实现一键部署到服务器。

## 📋 前置要求

### 本地环境
- Node.js >= 18.0.0
- pnpm >= 9.0.0
- make 工具
- ssh 客户端

### 服务器环境
- Ubuntu 20.04+ / CentOS 8+ (推荐)
- Node.js >= 18.0.0
- PM2 进程管理器
- SSH 访问权限

## ⚙️ 配置步骤

### 1. 修改配置文件

在项目根目录的 `Makefile` 中修改以下变量：

```makefile
SERVER_HOST ?= your-server-ip        # 你的服务器IP
SERVER_USER ?= root                   # SSH用户名
SERVER_PORT ?= 22                     # SSH端口
PROJECT_NAME ?= email-templates       # 项目名称
REMOTE_DIR ?= /var/www/email-templates # 服务器部署目录
```

### 2. 设置SSH密钥认证 (推荐)

```bash
# 生成SSH密钥
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 复制公钥到服务器
ssh-copy-id root@your-server-ip
```

### 3. 初始化服务器环境

```bash
# 一键安装服务器环境 (Node.js, PM2, pnpm)
make setup-server SERVER_HOST=your-server-ip
```

## 🚀 部署命令

### 首次完整部署
```bash
make deploy SERVER_HOST=your-server-ip
```

### 快速更新 (仅上传代码)
```bash
make quick-deploy SERVER_HOST=your-server-ip
```

### 其他常用命令

```bash
# 查看应用状态
make status SERVER_HOST=your-server-ip

# 重启应用
make restart SERVER_HOST=your-server-ip

# 查看日志
make logs SERVER_HOST=your-server-ip

# 实时日志
make logs-follow SERVER_HOST=your-server-ip

# 健康检查
make health-check SERVER_HOST=your-server-ip

# 备份项目
make backup SERVER_HOST=your-server-ip
```

## 📂 项目结构

部署后的服务器目录结构：

```
/var/www/email-templates/
├── .output/                 # Nuxt构建产物
├── ecosystem.config.cjs     # PM2配置文件
├── package.json            # 项目依赖
├── pnpm-lock.yaml         # 锁定依赖版本
├── logs/                   # 应用日志
│   ├── pm2-error.log       # 错误日志
│   ├── pm2-out.log         # 标准输出日志
│   └── pm2-combined.log    # 综合日志
└── node_modules/           # 依赖包
```

## 🔧 PM2 管理

### 基本命令
```bash
# 启动应用
pm2 start ecosystem.config.cjs --env production

# 停止应用
pm2 stop email-templates

# 重启应用
pm2 restart email-templates

# 重载应用 (零停机)
pm2 reload email-templates

# 查看状态
pm2 status

# 查看日志
pm2 logs email-templates

# 监控面板
pm2 monit

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

## 🔒 安全配置

### 1. 防火墙设置
```bash
# Ubuntu/Debian
sudo ufw allow 22     # SSH
sudo ufw allow 3003   # 应用端口
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=3003/tcp
sudo firewall-cmd --reload
```

### 2. 环境变量配置

复制环境变量模板：
```bash
cp .env.production.example .env.production
```

编辑 `.env.production` 文件，设置生产环境变量。

### 3. SSL 证书 (可选)

如果需要 HTTPS，可以在 PM2 配置中设置：

```javascript
env: {
  NITRO_SSL_CERT: '/path/to/cert.pem',
  NITRO_SSL_KEY: '/path/to/key.pem'
}
```

## 📊 监控和日志

### 应用监控
```bash
# 实时监控
make monitor SERVER_HOST=your-server-ip

# 查看系统信息
make server-info SERVER_HOST=your-server-ip
```

### 日志管理
```bash
# 查看最近50行日志
make logs SERVER_HOST=your-server-ip

# 清理旧日志
make clean-logs SERVER_HOST=your-server-ip
```

## 🔄 CI/CD 集成

可以将部署命令集成到 GitHub Actions 或其他 CI/CD 平台：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup SSH
      run: |
        mkdir -p ~/.ssh
        echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
        chmod 600 ~/.ssh/id_rsa
        ssh-keyscan -p ${{ secrets.SSH_PORT }} ${{ secrets.SSH_HOST }} >> ~/.ssh/known_hosts
    
    - name: Deploy
      run: |
        make deploy SERVER_HOST=${{ secrets.SSH_HOST }} SERVER_USER=${{ secrets.SSH_USER }}
```

## ❗ 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   netstat -tlnp | grep :3003
   # 或
   lsof -i :3003
   ```

2. **权限问题**
   ```bash
   # 修改目录权限
   sudo chown -R $USER:$USER /var/www/email-templates
   ```

3. **内存不足**
   ```bash
   # 添加交换空间
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

4. **应用启动失败**
   ```bash
   # 查看详细错误日志
   pm2 logs email-templates --err
   ```

### 性能优化

1. **启用 gzip 压缩**
   ```bash
   # Nginx 配置
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **设置反向代理**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3003;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 📞 技术支持

如果在部署过程中遇到问题，请：

1. 查看错误日志：`make logs SERVER_HOST=your-server-ip`
2. 检查应用状态：`make status SERVER_HOST=your-server-ip`
3. 验证服务器环境：`make server-info SERVER_HOST=your-server-ip`

---

**祝你部署顺利！** 🎉