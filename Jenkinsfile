pipeline {
    agent any

    tools {
        nodejs "NodeJS"  // 使用 Jenkins 中配置的 Node.js 工具名称
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm  // 拉取代码
            }
        }

        stage('Install pnpm') {
            steps {
                // 全局安装 pnpm（如果 Jenkins 的 Node.js 工具未预装）
                sh 'npm install -g pnpm'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'  // 使用 pnpm 安装依赖
            }
        }

        stage('Build') {
            steps {
                sh 'pnpm run build'  // 使用 pnpm 执行构建
            }
        }

        stage('Deploy with PM2') {
            steps {
                script {
                    sh 'pm2 stop email-editor || true'
                    sh 'pm2 start ecosystem.config.cjs'
                }
            }
        }
    }

    post {
    always {
        // 只清理 @tmp 等临时目录，保留主工作空间
        cleanWs(
            cleanWhenAborted: true,
            cleanWhenFailure: true,
            cleanWhenSuccess: true,
            deleteDirs: true,
            patterns: [
                [pattern: '@tmp/**', type: 'INCLUDE'],
                [pattern: 'node_modules/**', type: 'INCLUDE']
            ]
        )
    }
}
}
