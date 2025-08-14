pipeline {
    agent any
    tools {
        nodejs 'nodejs-22.6.0'
    }
    withCredentials([usernamePassword(credentialsId: 'mongo-credintials', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
    sh 'export MONGO_URI="mongodb://${USER}:${PASS}@127.0.0.1:27017/superData" && npm test'
    }

    stages {
        stage('Installing dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }
    
        stage('NPM dependencies scanning') {
            parallel {
                stage('NPM dependencies audit') {
                    steps {
                        sh 'npm audit --audit-level=critical'
                        sh 'echo $?'
                    }
                }
                stage('OWASP dependencies check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan ./ 
                            --out ./ 
                            --format ALL
                            --prettyPrint
                            --noupdate
                        ''', odcInstallation: 'OWASP-DependencyCheck-10' 
                    }
                }
                
                }
                
            }
        
        stage('Unit tests') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'mongo-credintials', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                    sh 'npm test'
                }
                junit allowEmptyResults: true, stdioRetention: '' , testResults: 'test-results.xml'
            }
        }
    }
}

