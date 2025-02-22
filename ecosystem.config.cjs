// .output/ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'email-editor',
    script: './server/index.mjs',  // 使用相对路径（基于 .output 目录）
    cwd: __dirname,  // 固定工作目录为配置文件所在位置
    instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    }
  }]
}
