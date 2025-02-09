module.exports = {
    apps: [{
        name: 'email-editor',
        script: '.output/server/index.mjs', // 使用相对路径
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 3003,
            HOST: '0.0.0.0'
        }
    }]
}