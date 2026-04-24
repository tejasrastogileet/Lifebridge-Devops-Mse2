# 🌉 LifeBridge - DevOps Integrated Full Stack Platform

LifeBridge is a full-stack organ donation and transplant coordination platform.

This project demonstrates a **complete DevOps lifecycle** including:
- Git branching strategy
- CI/CD pipeline
- Code quality analysis
- Docker containerization
- Cloud deployment

---

## 🧠 Project Overview

LifeBridge allows:
- User authentication (signup/login)
- Donor registration
- Hospital request management
- Searching organ/blood requests

---

## 🏗️ Tech Stack

### Frontend
- React (CRA)
- Axios
- Environment Variables

### Backend
- Node.js + Express
- MongoDB Atlas
- JWT Authentication

---

# ⚙️ DevOps Implementation (MAIN FOCUS 🔥)

## 🔀 Git Workflow


dev → PR → CI → main → deploy


- `dev` branch for development
- `main` branch for production
- Pull Request used before merging

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Pipeline runs automatically on push/PR:

### Steps:
1. Install dependencies
2. Backend checks
3. Frontend build
4. SonarCloud analysis
5. Docker build validation

---

## 🧪 SonarCloud (Code Quality)

- Detects bugs & vulnerabilities
- Maintains clean code
- Quality gate enforced before deployment

---

## 🐳 Docker

- Backend and frontend containerized
- Ensures consistent environment

```bash
docker compose up --build
🌐 Deployment
Service	Platform
Frontend	Vercel
Backend	Render
Database	MongoDB Atlas
🔐 Environment Variables
Backend (.env)
PORT=5000
JWT_SECRET=your_secret
MONGODB_URI=your_uri
FRONTEND_URL=https://lifebridge-devops-mse2.vercel.app
Frontend (.env.production)
REACT_APP_API_URL=https://lifebridge-devops-mse2.onrender.com
🚀 Live Project

Frontend: https://lifebridge-devops-mse2.vercel.app

Backend: https://lifebridge-devops-mse2.onrender.com

🧪 API Endpoints
POST /api/auth/signup
POST /api/auth/login
