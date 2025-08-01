// ecosystem.config.cjs
const path = require('path');

module.exports = {
    apps: [{
        name: 'email_app',
        script: './.output/server/index.mjs',
        cwd: path.resolve(__dirname),
        instances: 'max', // 根据CPU核心数启动实例
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_restarts: 10,
        min_uptime: '10s',
        max_memory_restart: '1G',
        node_args: '--max-old-space-size=1024',
        env: {
            NODE_ENV: 'production',
            NITRO_PORT: 3003,
            NITRO_HOST: '0.0.0.0'
        },
        env_development: {
            NODE_ENV: 'development',
            NITRO_PORT: 3004,
            NITRO_HOST: '0.0.0.0'
        },
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        error_file: './logs/pm2-error.log',
        out_file: './logs/pm2-out.log',
        log_file: './logs/pm2-combined.log',
        time: true,
        kill_timeout: 3000,
        listen_timeout: 3000
    }],

    // deploy 配置已移除 - 使用 Makefile 进行部署管理
}