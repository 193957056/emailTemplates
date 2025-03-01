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
                    // 直接使用当前目录的配置文件
                    sh 'pm2 stop email-editor || true'
                    sh 'pm2 start ecosystem.config.cjs'
                }
            }
        }

        stage('Clean Workspace') {
            steps {
                script {
                    // 删除除 .output 和 ecosystem.config.cjs 外的所有内容
                    sh '''
                        find . -mindepth 1 -maxdepth 1 \
                            ! -name '.output' \
                            ! -name 'ecosystem.config.cjs' \
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
