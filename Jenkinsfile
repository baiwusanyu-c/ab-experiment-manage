pipeline {
    agent any
    stages {
        stage('init project A/B-TEST'){
                steps{
                    bat 'pnpm run init'
                }
            }
        stage('build project A/B-TEST'){
            steps{
                bat 'pnpm run build:prod'
            }
        }
    }
}