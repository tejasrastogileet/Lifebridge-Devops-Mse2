# 🫀 LifeBridge
### Full-Stack Organ Donation & Transplant Coordination Platform  
**CI/CD • Docker • SonarCloud • Vercel • Render**

> Bridging the gap between donors and patients through technology ❤️

---

## 🚀 Live Demo
- 🌐 Frontend: https://lifebridge-devops-mse2.vercel.app  
- 🔧 Backend API: https://lifebridge-devops-mse2.onrender.com  

---

## 🎯 Problem Statement

Organ donation systems face critical issues:

❌ Lack of real-time donor-patient coordination  
❌ Manual and inefficient request handling  
❌ No centralized platform for tracking requests  
❌ Delays in emergency organ matching  

---

## 💡 Solution

LifeBridge provides:

✅ Donor & patient registration system  
✅ Real-time organ request handling  
✅ Secure authentication (JWT)  
✅ Centralized dashboard for tracking  
✅ Scalable full-stack architecture  

---

## ✨ Features

### 👤 Authentication System
- Secure Signup/Login
- JWT-based authentication
- Role-based users (Donor / Hospital)

### 🩸 Donor Dashboard
- View available requests
- Search by organ type
- Track donation status

### 🏥 Hospital System
- Create organ requests
- Manage patient needs
- Track donors

### 🔍 Search & Filter
- Organ-based filtering
- Blood group filtering

---

## 🏗️ Architecture


User (Browser)
│
▼
React (Frontend - Vercel)
│
▼
Node.js + Express (Backend - Render)
│
▼
MongoDB (Database)


---

## ⚙️ Tech Stack

| Layer        | Technology |
|-------------|------------|
| Frontend     | React (CRA) |
| Backend      | Node.js + Express |
| Database     | MongoDB |
| Auth         | JWT |
| CI/CD        | GitHub Actions |
| Code Quality | SonarCloud |
| Deployment   | Vercel + Render |
| Container    | Docker |

---

## 🔄 DevOps & CI/CD Pipeline (🔥 IMP)

### Pipeline Flow:


Dev Branch → GitHub Actions → SonarCloud → Docker → PR → Main → Deployment


### 🔹 What Happens Automatically:

- ✅ Backend build & validation  
- ✅ Frontend build  
- ✅ SonarCloud code quality check  
- ✅ Docker container validation  

👉 Only after all checks pass → code is merged into `main`

---

## 🔍 Why Dev Branch?

- `main` = Production  
- `dev` = Development  

👉 Ensures:
- Safe development  
- No direct production break  

---

## 🧪 SonarCloud Integration

- Detects bugs 🐞  
- Ensures clean code 🧹  
- Checks security issues 🔐  

---

## 🐳 Docker Support

```bash
docker compose up --build
Runs frontend + backend in containers
Ensures same environment everywhere
🌍 Deployment
Service	Platform
Frontend	Vercel
Backend	Render
⚡ Environment Variables
Backend (.env)
PORT=5000
JWT_SECRET=your_secret
MONGODB_URI=your_mongodb_uri
FRONTEND_URL=https://lifebridge-devops-mse2.vercel.app
Frontend (.env.production)
REACT_APP_API_URL=https://lifebridge-devops-mse2.onrender.com
🧪 Debugging Tasks (IMPORTANT - 10 MARKS 💯)
🔴 Issue 1: CORS Error
Problem: Frontend blocked by backend
Fix: Added Vercel domain in backend CORS
🔴 Issue 2: Wrong API Endpoint
Problem: /api/auth vs /api/v1/user mismatch
Fix: Added alias routes for compatibility
🔴 Issue 3: Environment Variables
Problem: API URL hardcoded
Fix: Used process.env.REACT_APP_API_URL
🔴 Issue 4: Deployment Failures
Fixed Docker build issues
Fixed CI pipeline errors
📁 Project Structure
LifeBridge/
│
├── frontend/        # React App
├── backend/         # Node.js API
├── .github/workflows/
├── docker-compose.yml
├── Dockerfile
└── README.md
🚀 Getting Started
Backend
cd backend
npm install
npm start
Frontend
cd frontend
npm install
npm start
👥 Team RCB 🔥
Name	Role
Vidhit Hatwaliya	Frontend Developer
Visu Chaudhary	Backend Developer
Tejas Rastogi	DevOps Lead (CI/CD, Docker, Deployment)
Vishal Pal	Testing & Integration
🤝 Team Contribution
Followed Git workflow (dev → PR → main)
Implemented full CI/CD pipeline
Debugged real production issues
Deployed scalable application
🏆 Final Note

This is not just a project — it is a production-ready system with real DevOps practices including CI/CD, Docker, code quality checks, and cloud deployment.

Made with ❤️ by Team RCB
