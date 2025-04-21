# 🌍 Secure Country Insights – API Middleware System

This is a full-stack web application developed for the 6COSC022W coursework. It functions as a secure API middleware that enables users to register, log in, generate/manage API keys, and retrieve selected country data from the [REST Countries API](https://restcountries.com). The platform includes secure authentication, role-based access (user/admin), and JWT session handling through HttpOnly cookies.

---

## 🔐 Key Features

### 🔑 Authentication & Access Control
- Register as either a **user** or an **admin**
- Secure login system using `bcrypt` for hashing passwords
- JWT-based session management (stored in HttpOnly cookies)
- Automatic JWT token refresh mechanism for active sessions

### 🧩 API Key Features
- Users can generate and remove their own API keys
- Select a preferred API key when requesting country data
- Unused keys (inactive over 2 days) are tracked

### 🌐 Country Lookup
- Users can search for countries through the middleware
- Results include:
  - Name
  - Capital city
  - Currency
  - Languages spoken
  - National flag

### 🛠 Admin Features
- View all user accounts with last login timestamps and key counts
- Identify and revoke API keys that have not been used recently
- Detect and analyze users with abnormal API key usage
- System logs admin actions for traceability

### 🖥 Frontend (React)
- Modern, responsive design for all interfaces
- Toast notifications via `react-toastify` (no intrusive alerts)
- Smooth user interactions with input validation and loading indicators

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:3001`.

---

## 📁 Project Structure

```
📦 backend
 ┣ 📂controllers
 ┣ 📂models
 ┣ 📂routes
 ┣ 📂middleware
 ┣ 📂utils
 ┣ 📜server.js

📦 frontend
 ┣ 📂components
 ┣ 📜App.js
 ┣ 📜MainRoutes.js
```

---

## 🔗 API Endpoint Overview

| Method | Endpoint                         | Role   | Description                            |
|--------|----------------------------------|--------|----------------------------------------|
| POST   | /auth/register                   | Public | Register as a new user or admin        |
| POST   | /auth/login                      | Public | Log in and initiate a session          |
| GET    | /auth/get-api-keys               | User   | View current API keys                  |
| POST   | /auth/generate-api-key           | User   | Create a new API key                   |
| DELETE | /auth/delete-api-key/:apiKey     | User   | Delete a specific API key              |
| GET    | /countries/:country              | User   | Get filtered country details           |
| GET    | /admin/users                     | Admin  | View all registered users              |
| GET    | /admin/unused-api-keys           | Admin  | See keys not used in over 2 days       |
| POST   | /admin/api-key-owners            | Admin  | Analyze API key usage by users         |
| DELETE | /admin/api-key/:userId           | Admin  | Revoke a user’s API key                |

---

## 🔒 Security Measures

- JWT stored securely in HttpOnly cookies
- Auto-refresh for expired tokens to ensure a smooth user experience
- Strict access rules for different roles (admin/user)
- Validation for all requests using API keys
- Admin audit logging to monitor activity

---

## 🧪 Testing Guide

This section outlines how to manually test the middleware system from both user and admin perspectives. Ideal for walkthroughs or assessments.

---

### 🔧 Prerequisites

Ensure:
- Backend is live at `http://localhost:3000`
- Frontend is running at `http://localhost:3001`
- i’ve created both a user and an admin account

---

### 👤 User Testing

1. **Register a User**  
   Navigate to `/register`, fill in credentials, and choose “User”

2. **Log In as a User**  
   Go to `/login` and enter credentials → redirected to User Dashboard

3. **Generate API Key**  
   Click on “Generate API Key” → new key appears in list

4. **Search a Country**  
   Select API key → enter country name (e.g., `Canada`) → submit

---

### 🛡 Admin Testing

1. **Register an Admin**  
   Repeat registration process but choose “Admin”

2. **Log In as Admin**  
   Enter login info → access Admin Dashboard

3. **View Users**  
   See registered users, last login time, and number of keys

4. **Check Unused Keys**  
   Find keys idle for over 2 days → revoke as needed

5. **Audit Risky Users**  
   Review users with high-risk or high-usage patterns

---

## 🐳 Optional: Docker Setup

You can add Docker support using a Dockerfile and `docker-compose.yml` to containerize the frontend and backend for a production-ready environment.

---

## 🎓 Acknowledgments

Developed as part of the **Web & API Development** module – 6COSC022W  
University of Westminster

---

## 📬 Contact

**Maintainer**: ramzy zarook
**Student ID**: 20211241
📧 Email: `ramzyzarook@gmail.com` / `mohamed.20211241@iit.ac.lk`

