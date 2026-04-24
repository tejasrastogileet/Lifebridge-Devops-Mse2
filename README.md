# 🌉 LifeBridge - DevOps Enabled Full Stack Platform

LifeBridge is a **full-stack organ donation and transplant coordination platform** designed to connect donors, recipients, and hospitals efficiently.

This project demonstrates a **complete DevOps pipeline** from development → testing → containerization → CI/CD → production deployment.

---

## 🧠 Project Overview

LifeBridge allows:
- Users to register as donors
- Hospitals to post organ/blood requests
- Users to search and respond to requests
- Secure authentication & role-based access

---

## 🏗️ Tech Stack

### 🔹 Frontend
- React (Create React App)
- Axios
- Environment-based API config

### 🔹 Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication

---

## ⚙️ DevOps Implementation (Core Highlight 🔥)

This project is built with **real-world DevOps practices**:

---

### 🔄 1. CI/CD Pipeline (GitHub Actions)

Automated pipeline using:


.github/workflows/ci.yml


#### CI Steps:
- Install dependencies
- Run backend checks
- Build frontend
- Run test scripts
- SonarCloud code analysis
- Docker build validation

#### CD Flow:
- Code pushed → CI runs automatically
- On success → ready for deployment

---

### 🧪 2. Code Quality (SonarCloud)

- Static code analysis
- Code coverage checks
- Bug & vulnerability detection
- Quality gate validation

---

### 🐳 3. Docker Containerization

Both services are containerized:

#### Backend:
```bash
docker build -t lifebridge-backend ./backend
Frontend:
docker build -t lifebridge-frontend ./frontend
Docker Compose:
docker compose up --build
🌐 4. Deployment Architecture
Service	Platform
Frontend	Vercel
Backend	Render
Database	MongoDB Atlas
🔐 5. Environment Configuration
Backend (.env)
PORT=5000
JWT_SECRET=your_secret
MONGODB_URI=your_mongodb_uri
FRONTEND_URL=https://your-frontend-url
Frontend (.env.production)
REACT_APP_API_URL=https://your-backend-url
🔥 6. Key DevOps Challenges Solved
✅ CORS configuration for production frontend
✅ Environment variable handling (build-time vs runtime)
✅ API route alignment (frontend ↔ backend)
✅ Docker CI failures (DB dependency handling)
✅ Git workflow (dev → PR → main merge)
✅ Production debugging via logs
🔀 Git Workflow
dev → development branch
main → production branch
Pull Request → merge into main
CI runs on PR + push
🚀 Live Deployment
🌐 Frontend: https://lifebridge-devops-mse2.vercel.app
⚙️ Backend: https://lifebridge-devops-mse2.onrender.com
💻 Local Development
Backend
cd backend
npm install
npm start
Frontend
cd frontend
npm install
npm start
🧪 API Endpoints
POST /api/auth/signup
POST /api/auth/login
📦 Project Structure
LifeBridge/
│
├── frontend/        # React app
├── backend/         # Node.js API
├── docker-compose.yml
├── .github/workflows/
│   └── ci.yml
🎯 What This Project Demonstrates
Full Stack Development
Real CI/CD Pipeline
Docker-based architecture
Cloud deployment (Vercel + Render)
Debugging production issues
DevOps integration with real app
🧠 Key Learnings
CI/CD ≠ working production (configuration matters)
CORS is critical in frontend-backend integration
Environment variables must be handled carefully
API route consistency is essential
Docker requires dependency awareness (DB handling)
👨‍💻 Author

Tejas Rastogi
