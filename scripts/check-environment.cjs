#!/usr/bin/env node

/**
 * 环境检查脚本
 * 检查 Node.js 版本和项目依赖是否满足要求
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNodeVersion() {
  const currentVersion = process.version;
  const majorVersion = parseInt(currentVersion.slice(1).split('.')[0]);
  
  log(`\n🔍 检查 Node.js 版本...`, 'blue');
  log(`当前版本: ${currentVersion}`);
  
  if (majorVersion >= 18) {
    log(`✅ Node.js 版本满足要求 (>= 18.0.0)`, 'green');
    return true;
  } else {
    log(`❌ Node.js 版本过低，需要 >= 18.0.0`, 'red');
    log(`\n📋 升级步骤:`, 'yellow');
    log(`1. 安装 nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`);
    log(`2. 重新加载终端: source ~/.bashrc`);
    log(`3. 安装 Node.js 18: nvm install 18`);
    log(`4. 使用 Node.js 18: nvm use 18`);
    log(`5. 设为默认版本: nvm alias default 18`);
    return false;
  }
}

function checkNpmVersion() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(npmVersion.split('.')[0]);
    
    log(`\n🔍 检查 npm 版本...`, 'blue');
    log(`当前版本: ${npmVersion}`);
    
    if (majorVersion >= 9) {
      log(`✅ npm 版本满足要求 (>= 9.0.0)`, 'green');
      return true;
    } else {
      log(`⚠️  npm 版本较低，建议升级到 >= 9.0.0`, 'yellow');
      log(`升级命令: npm install -g npm@latest`);
      return true; // npm 版本低不是致命错误
    }
  } catch (error) {
    log(`❌ 无法检查 npm 版本: ${error.message}`, 'red');
    return false;
  }
}

function checkPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  log(`\n🔍 检查 package.json...`, 'blue');
  
  if (!fs.existsSync(packageJsonPath)) {
    log(`❌ 找不到 package.json 文件`, 'red');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // 检查 engines 字段
    if (packageJson.engines && packageJson.engines.node) {
      log(`✅ 已设置 Node.js 版本要求: ${packageJson.engines.node}`, 'green');
    } else {
      log(`⚠️  建议在 package.json 中设置 engines 字段`, 'yellow');
    }
    
    // 检查关键依赖
    const requiredDeps = ['nuxt', 'vue', 'typescript'];
    const missingDeps = [];
    
    requiredDeps.forEach(dep => {
      if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
        missingDeps.push(dep);
      }
    });
    
    if (missingDeps.length === 0) {
      log(`✅ 关键依赖都已安装`, 'green');
    } else {
      log(`❌ 缺少关键依赖: ${missingDeps.join(', ')}`, 'red');
      return false;
    }
    
    return true;
  } catch (error) {
    log(`❌ 解析 package.json 失败: ${error.message}`, 'red');
    return false;
  }
}

function checkNodeModules() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  log(`\n🔍 检查依赖安装...`, 'blue');
  
  if (!fs.existsSync(nodeModulesPath)) {
    log(`❌ node_modules 目录不存在，需要安装依赖`, 'red');
    log(`运行命令: npm install`, 'yellow');
    return false;
  }
  
  // 检查关键包是否存在
  const criticalPackages = ['nuxt', 'vue', 'typescript', 'vue-tsc'];
  const missingPackages = [];
  
  criticalPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (!fs.existsSync(pkgPath)) {
      missingPackages.push(pkg);
    }
  });
  
  if (missingPackages.length === 0) {
    log(`✅ 关键依赖包都已安装`, 'green');
    return true;
  } else {
    log(`❌ 缺少关键依赖包: ${missingPackages.join(', ')}`, 'red');
    log(`运行命令: npm install`, 'yellow');
    return false;
  }
}

function checkTypeScript() {
  try {
    log(`\n🔍 检查 TypeScript...`, 'blue');
    
    const tscVersion = execSync('npx tsc --version', { encoding: 'utf8' }).trim();
    log(`TypeScript 版本: ${tscVersion}`);
    
    // 检查 tsconfig.json
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
      log(`✅ tsconfig.json 存在`, 'green');
    } else {
      log(`⚠️  tsconfig.json 不存在`, 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`❌ TypeScript 检查失败: ${error.message}`, 'red');
    return false;
  }
}

function provideSolutions() {
  log(`\n🔧 解决方案:`, 'bold');
  log(`\n1. 升级 Node.js 到 18+:`);
  log(`   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`);
  log(`   source ~/.bashrc`);
  log(`   nvm install 18 && nvm use 18 && nvm alias default 18`);
  
  log(`\n2. 清理并重新安装依赖:`);
  log(`   rm -rf node_modules package-lock.json .nuxt`);
  log(`   npm install`);
  
  log(`\n3. 验证安装:`);
  log(`   npm run type-check`);
  log(`   npm run lint`);
  log(`   npm run dev`);
  
  log(`\n📖 详细指南请查看: UPGRADE_GUIDE.md`, 'blue');
}

function main() {
  log(`${'='.repeat(50)}`, 'blue');
  log(`🚀 邮件模板编辑器环境检查`, 'bold');
  log(`${'='.repeat(50)}`, 'blue');
  
  const checks = [
    checkNodeVersion(),
    checkNpmVersion(),
    checkPackageJson(),
    checkNodeModules(),
    checkTypeScript()
  ];
  
  const allPassed = checks.every(check => check);
  
  log(`\n${'='.repeat(50)}`, 'blue');
  
  if (allPassed) {
    log(`🎉 所有检查通过！环境配置正确。`, 'green');
    log(`\n可以运行以下命令启动项目:`, 'green');
    log(`npm run dev`, 'bold');
  } else {
    log(`❌ 环境检查失败，需要修复问题。`, 'red');
    provideSolutions();
  }
  
  log(`${'='.repeat(50)}`, 'blue');
}

// 运行检查
main();
