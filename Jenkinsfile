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

        stage('Setup Local MongoDB') {
            options { timestamps() }
            steps {
                sh '''
                    # Verify MongoDB is running
                    if pgrep mongod > /dev/null; then
                        echo "MongoDB is running ✓"
                    else
                        echo "MongoDB is not running. Please start it manually: sudo systemctl start mongod"
                        exit 1
                    fi
                    
                    # Test MongoDB connection
                    echo "Testing MongoDB connection..."
                    timeout 10 bash -c 'until nc -z 127.0.0.1 27017; do sleep 1; done' || {
                        echo "Cannot connect to MongoDB on port 27017"
                        echo "Please check if MongoDB is listening on the correct port"
                        exit 1
                    }
                    echo "MongoDB connection test successful ✓"
                '''
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
                        export MONGO_URI="mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@127.0.0.1:27017/superData?authSource=admin"
                        echo "Using MongoDB URI: $MONGO_URI"
                        npm test
                    '''
                }
                junit allowEmptyResults: true, testResults: 'test-results.xml'
            }
        }
    }
    
}
