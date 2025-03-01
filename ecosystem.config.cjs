// ecosystem.config.cjs
const path = require('path');

module.exports = {
  apps: [{
    name: 'email-editor',
    script: './.output/server/index.mjs',  // 从项目根目录指向构建产物
    cwd: path.resolve(__dirname),         // 工作目录保持项目根目录
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    }
  }]
}
