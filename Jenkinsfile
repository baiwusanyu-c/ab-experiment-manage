pipeline {
    agent any
    stages {
        stage('init project A/B-TEST'){
                steps{
                    bat 'npm -v'
                    bat 'pnpm -v'
                    bat 'npm run init'
                }
            }
        stage('build project A/B-TEST'){
            steps{
                bat 'npm run build:prod'
            }
        }
    }
}
