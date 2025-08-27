# 🌌 Solar System Node.js Application

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://jenkins.example.com)
[![Test Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)](https://sonarqube.example.com)
[![Docker Image](https://img.shields.io/badge/docker-mohamed710%2Fsolar--system--gitea-blue)](https://hub.docker.com/r/mohamed710/solar-system-gitea)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive **Solar System educational web application** built with modern DevOps practices, featuring automated CI/CD pipelines, security scanning, and multi-environment deployment strategies.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment)
- [Security & Quality](#-security--quality)
- [Monitoring & Observability](#-monitoring--observability)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

The Solar System application is an educational web platform that provides interactive information about planets in our solar system. Built with Node.js and Express, it features a modern web interface and RESTful API endpoints. The project demonstrates enterprise-level DevOps practices including automated testing, security scanning, containerization, and multi-environment deployment.

### Key Highlights

- **Educational Content**: Comprehensive information about all 9 celestial bodies (Sun + 8 planets)
- **Modern Web Interface**: Responsive design with interactive animations
- **RESTful API**: Well-documented endpoints for programmatic access
- **DevOps Excellence**: Complete CI/CD pipeline with security scanning
- **Multi-Environment**: Support for development, staging, and production deployments

## ✨ Features

### Core Functionality
- 🌞 Interactive solar system visualization
- 🪐 Detailed planet information (name, description, velocity, distance)
- 🔍 Search functionality by planet ID (0-8)
- 📱 Responsive web interface
- 🌐 RESTful API endpoints

### DevOps & Quality
- 🚀 Automated CI/CD pipeline with Jenkins
- 🔒 Security vulnerability scanning (OWASP ZAP, Trivy)
- 📊 Code quality analysis (SonarQube)
- 🐳 Docker containerization
- ☁️ Multi-cloud deployment (AWS, Kubernetes)
- 📈 Comprehensive test coverage (90%+)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (HTML/CSS/JS) │◄──►│   (Node.js/     │◄──►│   (MongoDB)     │
│                 │    │    Express)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                              │
│  Jenkins → Tests → Security Scan → Build → Deploy → Monitor   │
└─────────────────────────────────────────────────────────────────┘
```

### Application Structure
```
solar-system-gitea/
├── app.js                 # Main application entry point
├── app-controller.js      # Business logic controller
├── seed.js               # Database seeding script
├── index.html            # Frontend interface
├── app-test.js           # Test suite
├── Dockerfile            # Container configuration
├── Jenkinsfile           # CI/CD pipeline definition
└── coverage/             # Test coverage reports
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 22.6.0
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Mocha + Chai + Chai-HTTP
- **Coverage**: NYC (Istanbul)

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design with animations
- **JavaScript**: Vanilla JS for interactivity
- **Fonts**: Google Fonts (Ubuntu, Encode Sans, BioRhyme, Orbitron)

### DevOps & Infrastructure
- **CI/CD**: Jenkins with declarative pipelines
- **Containerization**: Docker
- **Security**: OWASP ZAP, Trivy, Dependency Check
- **Quality**: SonarQube
- **Cloud**: AWS (EC2, Lambda, S3)
- **Orchestration**: Kubernetes
- **Monitoring**: Slack notifications

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 8.x or higher
- **MongoDB** 5.x or higher
- **Docker** 20.x or higher (for containerized deployment)
- **Git** (for version control)

### System Requirements
- **RAM**: Minimum 2GB, Recommended 4GB
- **Storage**: Minimum 1GB free space
- **Network**: Internet access for external dependencies

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/mhmdmstfa2010/solar-system-gitea.git
cd solar-system-gitea
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
# Database Configuration
MONGO_URI=mongodb://localhost:27017/solar-system

# Application Configuration
NODE_ENV=development
PORT=3000

# Optional: External Services
GITHUB_TOKEN=your_github_token
DOCKERHUB_CREDENTIALS=your_dockerhub_credentials
```

### 4. Database Setup
```bash
# Start MongoDB service
sudo systemctl start mongod

# Seed the database with planet data
node seed.js
```

### 5. Start the Application
```bash
# Development mode
npm start

# Production mode
NODE_ENV=production npm start
```

## 💻 Usage

### Web Interface
1. Open your browser and navigate to `http://localhost:3000`
2. Use the interactive solar system interface
3. Enter a planet ID (0-8) to view detailed information
4. Click "Search the Planet" to retrieve planet data

### API Endpoints

#### Get Planet Information
```bash
POST /planet
Content-Type: application/json

{
  "id": 3
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Earth",
  "description": "Our home planet",
  "image": "",
  "velocity": "29.78 km/s",
  "distance": "149.6 million km"
}
```

#### Health Check Endpoints
```bash
GET /live    # Liveness probe
GET /ready   # Readiness probe
GET /os      # System information
GET /        # Main application
GET /api-docs # OpenAPI specification
```

### Available Planets
| ID | Name    | Description           | Velocity    | Distance        |
|----|---------|----------------------|-------------|-----------------|
| 0  | Sun     | Center of Solar System| 0 km/s      | 0 km           |
| 1  | Mercury | Closest to the Sun   | 47.87 km/s  | 57.91M km      |
| 2  | Venus   | Second planet        | 35.02 km/s  | 108.2M km      |
| 3  | Earth   | Our home planet      | 29.78 km/s  | 149.6M km      |
| 4  | Mars    | The Red Planet       | 24.07 km/s  | 227.9M km      |
| 5  | Jupiter | Largest planet       | 13.07 km/s  | 778.5M km      |
| 6  | Saturn  | Ringed planet        | 9.69 km/s   | 1.429B km      |
| 7  | Uranus  | Ice giant            | 6.81 km/s   | 2.871B km      |
| 8  | Neptune | Farthest planet      | 5.43 km/s   | 4.351B km      |

## 🧪 Testing

### Run Test Suite
```bash
# Unit tests
npm test

# Test with coverage
npm run coverage

# Integration tests (requires AWS credentials)
bash integration-testing.sh
```

### Test Coverage
The project maintains a minimum of **90% line coverage** as configured in `nyc` settings. Coverage reports are generated in the `coverage/` directory.

### Test Structure
- **Unit Tests**: API endpoint testing with Mocha/Chai
- **Integration Tests**: End-to-end testing with AWS deployment
- **Coverage Reports**: HTML and text-based coverage analysis

## 🔄 CI/CD Pipeline

The project features a comprehensive Jenkins pipeline with the following stages:

### Pipeline Stages
1. **Dependencies Installation** - npm install with audit
2. **Database Seeding** - Initialize MongoDB with planet data
3. **Security Scanning** - OWASP dependency check and npm audit
4. **Testing** - Unit tests with retry mechanism
5. **Code Coverage** - Coverage analysis and reporting
6. **SonarQube Analysis** - Code quality assessment
7. **Docker Build** - Container image creation
8. **Security Scan** - Trivy vulnerability scanning
9. **Docker Push** - Image registry upload
10. **Deployment** - Environment-specific deployment
11. **Integration Testing** - End-to-end validation
12. **Quality Gates** - Manual approval checkpoints

### Branch Strategy
- **Feature Branches** (`feature/*`): Deploy to AWS EC2 for testing
- **PR Branches** (`PR*`): Deploy to Kubernetes with GitOps
- **Main Branch**: Production deployment to AWS Lambda

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t solar-system:latest .

# Run container
docker run -d \
  --name solar-system \
  -p 3000:3000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/solar-system \
  solar-system:latest
```

### Kubernetes Deployment
```bash
# Apply GitOps configuration
kubectl apply -f solar-system-gitops/deployment.yml
kubectl apply -f solar-system-gitops/service.yml
```

### AWS Deployment
The application supports deployment to:
- **EC2**: Container-based deployment for development/testing
- **Lambda**: Serverless deployment for production
- **S3**: Static asset hosting and report storage

## 🔒 Security & Quality

### Security Measures
- **Dependency Scanning**: Automated vulnerability detection
- **Container Security**: Trivy scanning for container images
- **Code Quality**: SonarQube analysis and quality gates
- **DAST Testing**: OWASP ZAP security testing
- **Secret Management**: Jenkins credentials for sensitive data

### Quality Gates
- **Test Coverage**: Minimum 90% line coverage
- **Security Scan**: No critical vulnerabilities
- **Code Quality**: SonarQube quality gate compliance
- **Manual Approval**: Production deployment approval required

## 📊 Monitoring & Observability

### Health Checks
- **Liveness Probe**: `/live` endpoint for container health
- **Readiness Probe**: `/ready` endpoint for service readiness
- **System Info**: `/os` endpoint for host information

### Logging
- **Application Logs**: Console output with timestamps
- **Pipeline Logs**: Jenkins build logs with stage information
- **Error Tracking**: Comprehensive error logging and reporting

### Notifications
- **Slack Integration**: Build success/failure notifications
- **Email Alerts**: Pipeline status updates
- **Dashboard**: Jenkins and SonarQube monitoring dashboards

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- Follow existing code style and conventions
- Maintain test coverage above 90%
- Update documentation for new features
- Ensure security best practices

### Testing Requirements
- All new features must include tests
- Maintain or improve test coverage
- Integration tests for API changes
- Security testing for new endpoints

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Author**: Siddharth Barahalikar
- **Contributors**: Development and DevOps teams
- **Open Source**: Built with amazing open-source tools and libraries

## 📞 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/mhmdmstfa2010/solar-system-gitea/issues)
- **Documentation**: [Project Wiki](https://github.com/mhmdmstfa2010/solar-system-gitea/wiki)
- **Community**: [Discussions](https://github.com/mhmdmstfa2010/solar-system-gitea/discussions)

---

**Made with ❤️ by the Solar System Team**

*Last updated: December 2024*

