#!/bin/bash

# 一键升级 Node.js 脚本

echo "🚀 一键升级 Node.js 到 18+ 版本"
echo "================================"

# 检查当前版本
current_version=$(node --version 2>/dev/null || echo "未安装")
echo "当前 Node.js 版本: $current_version"

# 检查操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "检测到 macOS 系统"
    
    # 检查是否安装了 Homebrew
    if command -v brew &> /dev/null; then
        echo "✅ 检测到 Homebrew，使用 Homebrew 安装 Node.js 18"
        brew install node@18
        brew link node@18 --force
        echo "✅ Node.js 18 安装完成"
    else
        echo "📦 Homebrew 未安装，安装 nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        
        # 重新加载 nvm
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        echo "📦 安装 Node.js 18..."
        nvm install 18
        nvm use 18
        nvm alias default 18
        echo "✅ Node.js 18 安装完成"
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "检测到 Linux 系统"
    
    # 使用 NodeSource 仓库安装
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js 18 安装完成"
    
else
    echo "⚠️  未识别的操作系统，请手动安装 Node.js 18+"
    echo "访问: https://nodejs.org/en/download/"
    exit 1
fi

# 验证安装
new_version=$(node --version)
echo ""
echo "🎉 升级完成！"
echo "新版本: $new_version"

# 更新项目配置
echo ""
echo "📝 更新项目配置..."
cd "$(dirname "$0")"

# 更新 .nvmrc
echo "$new_version" | sed 's/^v//' > .nvmrc
echo "✅ 已更新 .nvmrc 文件"

# 重新安装依赖
echo "📦 重新安装项目依赖..."
rm -rf node_modules package-lock.json .nuxt
npm install

echo ""
echo "🎉 所有设置完成！"
echo ""
echo "现在可以运行："
echo "  npm run dev"
echo ""
echo "如果仍有问题，请重新打开终端后再试。"
