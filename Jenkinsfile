pipeline {
    agent any
    tools {
        nodejs 'nodejs-22.6.0'
    }
    environment {
        MONGO_URI = "mongodb://127.0.0.1:27017/superData"
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

