pipeline {
    agent any
    tools {
        nodejs 'nodejs-22.6.0'
    }

    stages {
        stage('Installing dependencies') {
            steps {
                sh  'npm install --no-audit'
            }
        }
    

        stage('NPM dependencies audit') {
            steps {
                sh  'npm audit --audit-level=critical'
               sh  'echo $?'           
            }
        }
    }
}