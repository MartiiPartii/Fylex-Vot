<div align="center">

![Fylex Logo](./client/public/images/logo-footer.webp)

# Fylex

**AI-Powered Document Security & Fraud Detection Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-brightgreen)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688)](https://fastapi.tiangolo.com/)

*Advanced document scanning that detects malicious activity line by line. Keep your data safe with intelligent threat detection.*

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

---

## 🎯 Overview

**Fylex** is a comprehensive AI-powered document security platform designed to protect users from fraud and malicious content in documents. The platform analyzes PDFs, contracts, emails, and other text-based documents using advanced AI models to detect:

- **Phishing attempts**
- **Lottery scams**
- **Financial manipulation**
- **Impersonation**
- **Other fraudulent activities**

The system provides detailed risk assessments with line-by-line analysis, highlighting suspicious content and assigning risk levels (High, Medium, Low) to help users make informed decisions about document safety.

---

## ✨ Features

### 🔒 Security & Analysis
- **Line-by-line document analysis** - Deep scanning of every sentence and element
- **Multi-risk detection** - Identifies various types of fraud and threats
- **Risk level assessment** - Categorizes threats as High, Medium, or Low
- **Detailed explanations** - Provides context for each detected risk
- **Fast processing** - Get security reports in seconds

### 👤 User Experience
- **OAuth authentication** - Sign in with Google or GitHub
- **User dashboard** - Monitor document security and analysis history
- **Document management** - Upload, view, and manage analyzed documents
- **Statistics tracking** - View total scans, threats detected, and clean documents
- **Profile management** - Customize your profile with picture upload

### 🛡️ Platform Features
- **Real-time analysis** - Instant document processing
- **Secure file storage** - Cloudinary integration for document storage
- **JWT authentication** - Secure token-based authentication
- **WebSocket support** - Real-time communication capabilities
- **Rate limiting** - API protection against abuse

---

## 🏗️ Architecture

Fylex follows a **microservices architecture** with three main components:

```
┌─────────────────┐
│   Client (UI)   │  Next.js 15 + React 19 + Material-UI
│   Port: 3000    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Server (API)   │  Spring Boot 3.5.5 + PostgreSQL
│   Port: 8000    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Model (AI)     │  FastAPI + OpenAI/HuggingFace
│   Port: 7000    │
└─────────────────┘
```

### Component Responsibilities

- **Client**: User interface, authentication, document upload, dashboard, and visualization
- **Server**: Business logic, database management, authentication, file processing, API orchestration
- **Model**: AI-powered document analysis, fraud detection, risk assessment

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15.5.9
- **UI Library**: React 19.1.1
- **Styling**: Material-UI (MUI) 7.3.2
- **Language**: TypeScript 5.9.3
- **Authentication**: OAuth (Google, GitHub)
- **Testing**: Vitest 4.0.15
- **Build Tool**: Next.js built-in

### Backend (Server)
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **File Processing**: Apache Tika 2.9.2
- **Storage**: Cloudinary
- **Build Tool**: Maven
- **WebSocket**: Spring WebSocket

### AI Service (Model)
- **Framework**: FastAPI 0.116.1
- **Language**: Python 3.13
- **AI Provider**: HuggingFace (Llama 3.3 70B)
- **Rate Limiting**: SlowAPI
- **HTTP Client**: httpx

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (production)
- **Version Control**: Git

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ and npm
- **Java** 17+
- **Maven** 3.6+
- **Python** 3.13+
- **Docker** and **Docker Compose** (recommended)
- **PostgreSQL** 12+ (if not using Docker)
- **HuggingFace API Token** (for AI model access)
- **Cloudinary Account** (for file storage)
- **Google OAuth Credentials**
- **GitHub OAuth Credentials**

---

## 🚀 Installation

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Fylex
   ```

2. **Set up environment variables**
   - Create `.env` files in each service directory (see [Configuration](#configuration))

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   The application will be available at:
   - **Client**: http://localhost:3000
   - **Server API**: http://localhost:8000
   - **Model API**: http://localhost:7000

### Option 2: Manual Setup

#### Client Setup
```bash
cd client
npm install
npm run dev
```

#### Server Setup
```bash
cd server
mvn clean install
mvn spring-boot:run
```

#### Model Setup
```bash
cd model
pip install -r requirements.txt
fastapi run app/api.py --port 8000
```

---

## ⚙️ Configuration

### Client Environment Variables

Create `client/.env`:

```env
SERVER_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
```

### Server Environment Variables

Create `server/.env`:

```env
# Application
SPRING_APPLICATION_NAME=server

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/fylex
SPRING_DATASOURCE_USERNAME=your-db-username
SPRING_DATASOURCE_PASSWORD=your-db-password

# JWT
JWT_SECRET=your-jwt-secret-key
EXPIRATIONMS=86400000

# OAuth
CLIENT_ID_GOOGLE=your-google-client-id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Model Environment Variables

Create `model/.env`:

```env
BASE_URL_HUGINGFACE=https://api-inference.huggingface.co/v1
HF_TOKEN=your-huggingface-token
CORS_ALLOWED_ORIGINS=http://localhost:8000
```

---

## 🏃 Running the Application

### Development Mode

**Client:**
```bash
cd client
npm run dev
```

**Server:**
```bash
cd server
mvn spring-boot:run
```

**Model:**
```bash
cd model
fastapi run app/api.py --port 8000
```

### Production Build

**Client:**
```bash
cd client
npm run build
npm start
```

**Server:**
```bash
cd server
mvn clean package
java -jar target/server-0.0.1-SNAPSHOT.jar
```

---

## 📁 Project Structure

```
Fylex/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # React components
│   │   ├── actions/        # Server actions
│   │   ├── services/       # Business logic services
│   │   ├── infrastructure/ # External API clients
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── tests/              # Test files
│
├── server/                 # Spring Boot backend application
│   ├── src/
│   │   └── main/
│   │       ├── java/       # Java source code
│   │       └── resources/  # Configuration files
│   └── pom.xml             # Maven dependencies
│
├── model/                  # FastAPI AI service
│   ├── app/
│   │   ├── api.py          # FastAPI application
│   │   ├── script.py       # AI analysis logic
│   │   └── base.py         # Data models
│   └── requirements.txt    # Python dependencies
│
└── docker-compose.yml      # Docker orchestration
```

---

## 🧪 Testing

### Client Tests

The client includes comprehensive test coverage:

```bash
cd client

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests once
npm run test:run
```

**Test Coverage:**
- Unit tests for services, actions, infrastructure, and utilities
- Integration tests for authentication, document upload, and error handling
- Middleware tests

### Server Tests

```bash
cd server
mvn test
```

---

## 📚 API Documentation

### Model Service API

**POST** `/ml/service/analysis`
- Analyzes document text for fraud detection
- Rate limit: 5 requests per minute
- Request body: `{ "text": "document content" }`
- Response: Analysis results with risk levels and explanations

### Server API

The server provides RESTful endpoints for:
- Authentication (login, register, OAuth)
- Document management (upload, list, view)
- User profile management
- Statistics and analytics

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Follows the existing code style
- Includes tests for new features
- Updates documentation as needed
- Passes all existing tests

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Nefara (Owners Dimitar Anastasov, Martin Velchev)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 Authors

**Nefara**
- **Dimitar Anastasov**
- **Martin Velchev**

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Spring Boot](https://spring.io/projects/spring-boot)
- AI analysis via [HuggingFace](https://huggingface.co/)
- UI components from [Material-UI](https://mui.com/)

---

<div align="center">

**Made with ❤️ by the Fylex Team**

![Fylex Footer Logo](./client/public/images/logo-footer.webp)

</div>
