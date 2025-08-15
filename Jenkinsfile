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
      steps   { sh 'npm test' }
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

    
  }
}
