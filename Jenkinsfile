pipeline {
  agent any

  tools {
    nodejs 'nodejs-22.6.0'
  }

  environment {
    MONGO_URI = credentials('mongo-credentials-uri')
    NODE_ENV  = 'test'
    SONAR_SCANNER_HOME = tool 'sonarQube-scanner-6.1.0'
    DOCKERHUB_CREDENTIALS = credentials('DockerHub_cred')
    GITHUB_TOKEN = credentials('github-token')
  }

  options {
    disableResume()
    disableConcurrentBuilds abortPrevious: true
  }

  stages {

    stage('Installing dependencies') {
      options { timestamps() }
      steps { sh 'npm install --no-audit' }
    }
    stage('Seed Database') {
      steps { sh 'node seed.js' }
    }

    stage('NPM dependencies scanning') {
      parallel {
        stage('NPM dependencies audit') {
          steps { sh 'npm audit --audit-level=critical || true' }
        }
        stage('OWASP dependencies check') {
          steps {
            dependencyCheck additionalArguments: '''
              --scan ./
              --out ./
              --format ALL
              --disableYarnAudit
              --prettyPrint
              --noupdate
            ''', odcInstallation: 'OWASP-DependencyCheck-10'
          }
        }
      }
    }

    stage('Unit tests') {
      options { retry(2) }
      steps { sh 'npm test' }
    }

    stage('Code coverage') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
          sh 'npm run coverage'
        }
        sh 'test -s coverage/lcov.info && echo "lcov found" || echo "WARNING: coverage/lcov.info missing or empty"'
      }
      post {
        always { junit allowEmptyResults: true, testResults: 'test-results.xml' }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        timeout(time: 2, unit: 'MINUTES') {
          withSonarQubeEnv('sonarqube-server') {
            sh """
              ${SONAR_SCANNER_HOME}/bin/sonar-scanner
            """
          }
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'printenv'
        sh 'docker build -t mohamed710/solar-system-gitea:$GIT_COMMIT .'
      }
    }

    
    stage('Trivy Scan') {
      steps {
        sh '''
          trivy image mohamed710/solar-system-gitea:$GIT_COMMIT \
            --severity LOW,MEDIUM,HIGH \
            --exit-code 0 \
            --quiet \
            --format json -o trivy-low-medium-report.json

          trivy image mohamed710/solar-system-gitea:$GIT_COMMIT \
            --severity CRITICAL \
            --exit-code 1 \
            --quiet \
            --format json -o trivy-critical-high-report.json
        '''
      }
      post {
        always {
          sh '''
            # Copy templates to workspace to avoid permission issues
            sudo cp /usr/local/share/trivy/templates/html.tpl .
            sudo cp /usr/local/share/trivy/templates/junit.tpl .
            chmod 644 html.tpl junit.tpl

            # Verify JSON files exist
            ls -l trivy-low-medium-report.json trivy-critical-high-report.json

            # Convert commands using local templates
            trivy convert --format template --template @./html.tpl --output trivy-medium-report.html trivy-low-medium-report.json
            trivy convert --format template --template @./html.tpl --output trivy-critical-report.html trivy-critical-high-report.json
            trivy convert --format template --template @./junit.tpl --output trivy-medium-report.xml trivy-low-medium-report.json
            trivy convert --format template --template @./junit.tpl --output trivy-critical-report.xml trivy-critical-high-report.json
          '''
          // Archive the generated reports
          archiveArtifacts artifacts: 'trivy-medium-report.html,trivy-critical-report.html,trivy-medium-report.xml,trivy-critical-report.xml', allowEmptyArchive: true
        }
      }
    } 
    stage('Docker Push') {
      steps {
         withDockerRegistry(credentialsId: 'DockerHub_cred', url: 'https://index.docker.io/v1/') {
          sh 'docker push mohamed710/solar-system-gitea:$GIT_COMMIT'
        }
      }
    }
    
    stage('Deploy to AWS ') {
      when {
       branch 'feature/*'
      }
      steps {
        script {
            sshagent(['AWS_SSH']) {
              sh '''
                ssh -o StrictHostKeyChecking=no ec2-user@54.242.25.204 "
                  if sudo docker ps -a | grep -q solar-system-gitea; then
                    echo 'Stopping and removing existing container'
                    sudo docker stop solar-system-gitea
                    sudo docker rm solar-system-gitea
                  fi
                  echo 'Pulling new image'
                  sudo docker pull mohamed710/solar-system-gitea:$GIT_COMMIT
                  echo 'Running new container'
                  sudo docker run -d --name solar-system-gitea \
                    -e MONGO_URI='$MONGO_URI' \
                    -p 3000:3000 mohamed710/solar-system-gitea:$GIT_COMMIT
                "
              '''
            }
          }

      }
    }
    stage('Integration Testing') {
      when {
       branch 'feature/*'
      }
      steps {
        sh 'printenv | grep -i branch'
        withAWS(credentials: 'AWS_Creds', region: 'us-east-1') {
        sh '''
          bash integration-testing.sh
        '''
        }
      }
    }
    stage('Kubernetes Deploy') {
      when {
       branch 'PR*'
      }
      steps {
        sh ' git clone -b main https://github.com/mhmdmstfa2010/solar-system-gitops.git'
        dir('solar-system-gitops') {
          sh '''
            git checkout main
            git checkout -b feature-$BUILD_ID
            sed -i "s#mohamed710/solar-system-gitea.*#mohamed710/solar-system-gitea:$GIT_COMMIT#g" deployment.yml
            cat deployment.yml
            #### add the sealed secrets to the gitops repo
            git config --global user.email "jenkins@solar-system.com"
            git config --global user.name "Jenkins"
            git remote set-url origin https://${GITHUB_TOKEN}@github.com/mhmdmstfa2010/solar-system-gitops.git
            git add .
            git commit -m "Update solar-system-gitea image to $GIT_COMMIT"
            git push origin feature-$BUILD_ID
          '''
        }
      }
    }
    stage('k8s-raise-PR') {
      when {
       branch 'PR*'
      }
      steps {
       sh """
            curl -X POST https://api.github.com/repos/mhmdmstfa2010/solar-system-gitops/pulls \
              -H "Accept: application/vnd.github+json" \
              -H "Authorization: token ${GITHUB_TOKEN}" \
              -d '{
                "title": "Update solar-system-gitea image to ${GIT_COMMIT}",
                "body": "Update docker image to ${GIT_COMMIT}",
                "head": "feature-${BUILD_ID}",
                "base": "main"
              }'
          """
      }
    }
    stage('APP deployed?') {
      when {
       branch 'PR*'
      }
      steps {
        timeout(time: 1, unit: 'DAYS') {
         input message: 'Is the app deployed?', ok: 'Yes'
        }
      }
    }
    stage('DAST Scan') {
      when {
       branch 'PR*'
      }
      steps {
        sh '''
        chmod 777 $(pwd)
        docker run -v $(pwd):/zap/wrk/:rw  ghcr.io/zaproxy/zaproxy  zap-api-scan.py  \
        -t http://192.168.49.2:32134/api-docs \
        -f openapi \
        -r zap-report.html \
        -J zap-report.json \
        -x zap-report.xml \
        -w zap-report.md 
        #### -c zap_ignore_rules
        '''
      }
    }

  }
  post {
    always {
      script {
        if (fileExists('solar-system-gitops')) {
          sh 'rm -rf solar-system-gitops'
        }
      }
  //    publishHTML target: ([
       // allowMissing: true,
        //alwaysLinkToLastBuild: true,
        //keepAll: true,
        //reportDir: './',
        //reportFiles: 'zap-report.html',
        //reportName: 'ZAP Report',
        //useWrapperFileDirectory: true])
    }
  }
}
