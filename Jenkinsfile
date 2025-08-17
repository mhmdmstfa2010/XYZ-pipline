pipeline {
  agent any

  tools {
    nodejs 'nodejs-22.6.0'
  }

  environment {
    MONGO_URI = credentials('mongo-credentials-uri')
    NODE_ENV  = 'test'
    SONAR_SCANNER_HOME = tool 'sonarQube-scanner-6.1.0'
  }

  options {
    disableResume()
    disableConcurrentBuilds abortPrevious: true
  }

  stages {
    stage('Seed Database') {
      steps { sh 'node seed.js' }
    }

    stage('Installing dependencies') {
      options { timestamps() }
      steps { sh 'npm install --no-audit' }
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
         withDockerRegistry(credentialsId: 'DockerHub_cred', url: 'https://hub.docker.com/repositories/mohamed710') {
          sh 'docker push mohamed710/solar-system-gitea:$GIT_COMMIT'
        }
      }
    }
  }
}