pipeline {
    agent any
    tools {
        nodejs 'nodejs-22.6.0'
    }

    stages {
        stage('VM node version') {
            steps {
                echo 'VM node version'
                sh 'node -v'
                sh 'npm -v'
            }
        }
    }
}