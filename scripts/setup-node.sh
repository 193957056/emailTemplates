#!/bin/bash

# 邮件模板编辑器 Node.js 环境设置脚本

set -e

echo "🚀 邮件模板编辑器 Node.js 环境设置"
echo "=================================="

# 检查当前 Node.js 版本
current_version=$(node --version 2>/dev/null || echo "未安装")
echo "当前 Node.js 版本: $current_version"

# 检查是否需要升级
if [[ "$current_version" =~ ^v1[8-9]\. ]] || [[ "$current_version" =~ ^v[2-9][0-9]\. ]]; then
    echo "✅ Node.js 版本满足要求 (>= 18.0.0)"
    
    # 更新 .nvmrc 文件
    echo "$current_version" | sed 's/^v//' > .nvmrc
    echo "📝 已更新 .nvmrc 文件为: $(cat .nvmrc)"
    
    echo "🎉 环境设置完成！可以运行项目了。"
    echo ""
    echo "下一步："
    echo "  npm install"
    echo "  npm run dev"
    
    exit 0
fi

echo "❌ Node.js 版本过低，需要升级到 18+"
echo ""

# 检查是否安装了 nvm
if command -v nvm &> /dev/null; then
    echo "✅ 检测到 nvm，开始安装 Node.js 18..."
    nvm install 18
    nvm use 18
    nvm alias default 18
    echo "✅ Node.js 18 安装完成"
elif [[ -s "$HOME/.nvm/nvm.sh" ]]; then
    echo "✅ 检测到 nvm，正在加载..."
    source "$HOME/.nvm/nvm.sh"
    nvm install 18
    nvm use 18
    nvm alias default 18
    echo "✅ Node.js 18 安装完成"
else
    echo "📦 nvm 未安装，开始安装 nvm..."
    
    # 安装 nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # 重新加载 nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    echo "✅ nvm 安装完成"
    
    # 安装 Node.js 18
    echo "📦 安装 Node.js 18..."
    nvm install 18
    nvm use 18
    nvm alias default 18
    
    echo "✅ Node.js 18 安装完成"
fi

# 更新 .nvmrc 文件
node_version=$(node --version | sed 's/^v//')
echo "$node_version" > .nvmrc
echo "📝 已更新 .nvmrc 文件为: $node_version"

echo ""
echo "🎉 环境设置完成！"
echo ""
echo "请重新打开终端或运行以下命令："
echo "  source ~/.bashrc  # 或 source ~/.zshrc"
echo "  cd $(pwd)"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "如果仍有问题，请查看 UPGRADE_GUIDE.md 获取详细说明。"
