pipeline {
    agent any
    tools {
        nodejs 'nodejs-22.6.0'
    }
    environment {
        MONGO_URI = credentials('mongo-credentials-uri')
        NODE_ENV = 'test'
    }
    options {
        disableResume()
        disableConcurrentBuilds abortPrevious: true
    }
    stages {
        stage('Seed Database') {
            steps {
                sh 'node seed.js'
            }
        }
        stage('Installing dependencies') {
            options { timestamps() }
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
            options { retry(2) }
            steps {
                sh 'npm test'
            }
        }
        stage('Code coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'Ooops , Errore', stageResult: 'UNSTABLE') {
                    sh 'npm run  coverage'
                }
                post {
                    always {
                        junit allowEmptyResults: true, testResults: 'test-results.xml'
                    }
                }
            }
        }
    }
}