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

        stage('Setup MongoDB') {
            options { timestamps() }
            steps {
                sh '''
                    # Check if Docker is available
                    if command -v docker &> /dev/null; then
                        echo "Using Docker to run MongoDB..."
                        
                        # Stop any existing MongoDB container
                        docker stop mongodb-test 2>/dev/null || true
                        docker rm mongodb-test 2>/dev/null || true
                        
                        # Start MongoDB container
                        docker run -d --name mongodb-test \
                            -p 27017:27017 \
                            -e MONGO_INITDB_ROOT_USERNAME=superuser \
                            -e MONGO_INITDB_ROOT_PASSWORD=password \
                            mongo:6.0
                        
                        # Wait for MongoDB to be ready
                        echo "Waiting for MongoDB to be ready..."
                        timeout 60 bash -c 'until docker exec mongodb-test mongosh --eval "db.adminCommand(\"ping\")" >/dev/null 2>&1; do sleep 2; done'
                        
                        echo "MongoDB is ready"
                    else
                        echo "Docker not available, trying system MongoDB..."
                        # Fallback to system MongoDB installation
                        if ! command -v mongod &> /dev/null; then
                            echo "Installing MongoDB..."
                            wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
                            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
                            sudo apt-get update
                            sudo apt-get install -y mongodb-org
                        fi
                        
                        # Start MongoDB service
                        sudo systemctl start mongod || sudo service mongod start
                        sudo systemctl enable mongod || sudo systemctl enable mongod
                        
                        # Wait for MongoDB to be ready
                        sleep 10
                        
                        # Check if MongoDB is running
                        if pgrep mongod > /dev/null; then
                            echo "MongoDB is running successfully"
                        else
                            echo "Failed to start MongoDB"
                            exit 1
                        fi
                    fi
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
                        npm test
                    '''
                }
                junit allowEmptyResults: true, testResults: 'test-results.xml'
            }
        }
    }
    
    post {
        always {
            sh '''
                # Cleanup MongoDB container if it exists
                docker stop mongodb-test 2>/dev/null || true
                docker rm mongodb-test 2>/dev/null || true
                echo "Cleanup completed"
            '''
        }
    }
}
