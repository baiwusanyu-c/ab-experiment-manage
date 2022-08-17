//定义远程服务器函数
def GetRemoteServer(ip,credentialsid){
    def remote = [:]
    remote.name = ip
    remote.host = ip
    remote.allowAnyHosts = true
    withCredentials([usernamePassword(credentialsId: credentialsid, passwordVariable: 'password', usernameVariable: 'username')]) {
        remote.user="${username}"
        remote.password="${password}"
    }
    return remote
}

pipeline {
    agent any
    //流水线配置信息
    options{
        timestamps()
        buildDiscarder(logRotator(numToKeepStr:'4'))
    }
    environment {
        GIT_URL='http://192.168.0.210:9080/dd/Beosin-TRACE/anti-fraud-front.git'
		GIT_USER_ID='055ea21b-e192-4962-ac69-03aaa300decf'
        SCANNER_HOME='/home/zfb/software/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/SCANNER'
		//开发服务器地址和账户
		DEV_SERVER_HOST='192.168.0.2'
		DEV_SERVER_USER_ID='15312c96-636f-41e5-b6ca-3c7af5d46bfc'

		DEV01_SERVER_HOST='192.168.0.219'
		DEV01_SERVER_USER_ID='4566aa7a-9735-4d45-ad8a-ef10548c1f5b'

		//测试服务器地址和账户
		TEST_SERVER_HOST='124.71.132.90'
		TEST_SERVER_USER_ID='bf848dbe-7cc9-4ccd-9e05-923bab19d2e8'
	}
    parameters{
        gitParameter(
		    branch: '',
		    branchFilter: '.*',
		    defaultValue: 'origin/develop',
		    description: '该分支来源于git仓库:anti-fraud-front',
		    listSize: '5',
		    name: '代码分支',
		    quickFilterEnabled: false,
		    selectedValue: 'DEFAULT',
		    sortMode: 'NONE',
		    tagFilter: '*',
            type: 'PT_BRANCH'
	    )
        choice(
            choices:["fraud-front"],
            name:'部署服务',
            description:'''fraud-front,需要和service.txt中的服务保持一致'''
        )
        choice(
            choices:["19081"],
            name:'部署端口',
            description:'''部署服务的端口号,需要和service.txt中的端口保持一致'''
        )
        choice(
            choices:['dev01', 'dev02', 'test02'],
            name:'部署环境',
            description:'''
            dev01:开发环境219
            dev02:开发环境
            test02:测试环境'''
        )
        booleanParam(defaultValue: false, name: '代码检查')
    }
    stages {
        stage('拉取代码') {
            steps {
                checkout poll: false,scm: [$class: 'GitSCM',branches: [[name: "${params.代码分支}"]],extensions: [],userRemoteConfigs: [[credentialsId: "${env.GIT_USER_ID}",url: "${env.GIT_URL}"]]]
            }
        }
        stage('质量检查') {
            when{
                expression{params.代码检查}
            }
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh "${env.SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectName=middle -Dsonar.projectKey=middle  -Dsonar.projectBaseDir=${WORKSPACE} -Dsonar.sources=."
                }
            }
        }
        stage('打包镜像') {
            steps {
                script{
                    sh "/data/script/web_package.sh ${WORKSPACE} ${params.部署环境} ${BUILD_NUMBER}"
                }
            }
        }
        stage('部署') {
            steps {
                script{

                    if("${params.部署环境}"=="dev01"){
                        reserver_dev=GetRemoteServer("${env.DEV01_SERVER_HOST}","${env.DEV01_SERVER_USER_ID}")
                        sshCommand remote: reserver_dev, command: "/data/service/script/hw_deploy_web.sh swr.cn-east-3.myhuaweicloud.com/beosin-develop/${params.部署服务}-${params.部署环境}_${params.部署端口}:${BUILD_NUMBER}"
                    }else if("${params.部署环境}"=="dev02"){
                        reserver_dev=GetRemoteServer("${env.DEV_SERVER_HOST}","${env.DEV_SERVER_USER_ID}")
                        sshCommand remote: reserver_dev, command: "/data/service/script/hw_deploy_web.sh swr.cn-east-3.myhuaweicloud.com/beosin-develop/${params.部署服务}-${params.部署环境}_${params.部署端口}:${BUILD_NUMBER}"
                    }else{
                        reserver_test=GetRemoteServer("${env.TEST_SERVER_HOST}","${env.TEST_SERVER_USER_ID}")
                        sshCommand remote: reserver_test, command: "/data/service/script/hw_deploy_web.sh swr.cn-east-3.myhuaweicloud.com/beosin-develop/${params.部署服务}-${params.部署环境}_${params.部署端口}:${BUILD_NUMBER}"
                    }
                }
            }
        }
    }
}