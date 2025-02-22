pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install pnpm') {
            steps { sh 'npm install -g pnpm' }
        }

        stage('Install Deps') {
            steps { sh 'pnpm install' }
        }

        stage('Build') {
            steps { sh 'pnpm run build' }
        }

        stage('Deploy with PM2') {
            steps {
                script {
                    // 将 PM2 配置文件移动到构建产物目录
                    sh 'cp ecosystem.config.cjs .output/'
                    
                    // 切换到构建目录启动
                    sh 'pm2 stop email-editor || true'
                    sh 'cd .output && pm2 start ecosystem.config.cjs'
                }
            }
        }

        stage('Clean Workspace') {
            steps {
                script {
                    // 删除除 .output 外的所有内容（包括隐藏文件）
                    sh '''
                        find . -mindepth 1 -maxdepth 1 \
                            ! -name '.output' \
                            ! -name '.' \
                            -exec rm -rf {} +
                    '''
                }
            }
        }
    }

    post {
        always {
            // 仅清理 @tmp 临时目录
            cleanWs(
                cleanWhenAborted: true,
                cleanWhenFailure: true,
                cleanWhenSuccess: true,
                deleteDirs: true,
                patterns: [[pattern: '@tmp/**', type: 'INCLUDE']]
            )
        }
    }
}
