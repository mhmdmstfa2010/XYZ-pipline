pipeline {
    agent any
    tools {
        nodejs 'nodejs-22.6.0'
    }
    options {
        disableResume()
        disableConcurrentBuilds abortPrevious: true
    }

    stages {
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
                withCredentials([usernamePassword(
                    credentialsId: 'mongo-credintials',
                    usernameVariable: 'MONGO_USERNAME',
                    passwordVariable: 'MONGO_PASSWORD'
                )]) {
                    sh '''
                        export MONGO_URI="mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@supercluster.d83jj.mongodb.net/superData?retryWrites=true&w=majority"
                        echo "Using MongoDB Atlas with credentials"
                        npm test
                    '''
                }
                junit allowEmptyResults: true, testResults: 'test-results.xml'
            }
        }
        
        stage('Code coverage') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'mongo-credintials',
                    usernameVariable: 'MONGO_USERNAME',
                    passwordVariable: 'MONGO_PASSWORD'
                )]) {
                    sh '''
                        export MONGO_URI="mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@supercluster.d83jj.mongodb.net/superData?retryWrites=true&w=majority"
                        echo "Using MongoDB Atlas with credentials for coverage"
                        npm run coverage
                    '''
                }
            }
        }
    }
}
