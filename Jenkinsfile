pipeline {
    agent any
    stages {
        stage('init project A/B-TEST'){
                steps{
                    bat 'npm -v'
                    bat 'npm config set registry https://registry.npm.taobao.org'
                    bat 'npm i'
                }
            }
        stage('build project A/B-TEST'){
            steps{
                bat 'npm run build:prod'
            }
        }
    }
}
