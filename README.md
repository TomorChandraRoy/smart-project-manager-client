# 🚀 Smart Project Manager

A full-stack, role-based project management application built with the MERN stack (MongoDB, Express, React, Node.js). It simplifies workflow by enabling efficient collaboration, task tracking, and role management for Admins, Project Managers, and Team Members.

---

## ✨ Features Overview

- **🔒 Role-Based Access Control:** Secure, customized views for Admin, Project Manager, and Team Member.
- **📊 Interactive Dashboards:** Visual insights and real-time data representation using `Recharts`.
- **📋 Task Management:** Assign, track, and update task progress (To Do, In Progress, Complete).
- **🔔 Notification System:** Real-time bell notifications with unread counts and direct actions.
- **🌗 Dark/Light Theme:** Premium UI with a seamless toggle between beautiful dark and light modes.
- **📱 Responsive UI:** Fully responsive and modern design powered by `Tailwind CSS v4`.

---

## 🛠️ Project Setup Instructions

Follow these step-by-step instructions to set up the project locally:

### 1. Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/en/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas)
- Git

### 2. Clone the Repository

```bash
git clone https://github.com/TomorChandraRoy/smart-project-manager-client.git
cd smart-project-manager-client
```

### 3. Install Dependencies

You need to install packages for both the `smart-project-manager-client` and `smart-project-manager-backend`.

**For smart-project-manager-backend:**

```bash
cd smart-project-manager-backend
npm install
```

**For smart-project-manager-client:**

```bash
cd ../smart-project-manager-client
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in both the `frontend` and `backend` root directories based on the following configurations.

### Backend (`backend/.env`)

```env
# Database Connections
DATABASE_LOCAL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=smart-project-manager
DATABASE_PROD=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=Cluster0
DB_NAME=smart-project-manager-data

DATABASE_LOCAL_USERNAME=your_db_username
DATABASE_LOCAL_PASSWORD=your_db_password

# Server Settings
NODE_ENV=development

# JWT Secret (Must be 32+ characters)
JWT_SECRET=your_super_secret_jwt_key_here

# Client URLs (CORS)
CLIENT=https://your-production-domain.web.app/
LOCAL_CLIENT=http://localhost:5173

# Email Configurations (For Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (`frontend/.env`)

```env
# API Base URL (Point to your backend)
VITE_API_URL=http://localhost:7000/api

# Image Hosting Key (e.g. ImgBB)
VITE_IMAGE_HOSTING_KEY=your_image_hosting_api_key_here
```

---

## 🏃 Running the Application

Once your dependencies are installed and `.env` files are created, you can run the application.

**1. Start smart-project-manager-backend Server:**

```bash
cd smart-project-manager-backend
npm run dev
# Server will run on http://localhost:7000
```

**2. Start smart-project-manager-client App:**

```bash
cd smart-project-manager-client
npm run dev
# App will run on http://localhost:5173
```

---

## 🔑 Demo Credentials

To quickly explore the app, use the following demo credentials (replace with your seeded database data if applicable):

| Role                | Email                 | Password      |
| :------------------ | :-------------------- | :------------ |
| **Admin**           | `admin@example.com`   | `password123` |
| **Project Manager** | `manager@example.com` | `password123` |
| **Team Member**     | `member@example.com`  | `password123` |

_(Note: Create these users in your database or sign up via the frontend and manually change roles in the database for testing.)_

---

## 🚀 Deployment Instructions

### smart-project-manager-backend Deployment (e.g., Vecel, Render, Railway, Heroku)

1. Push your code to GitHub.
2. Connect your repository to your hosting provider (like Render).
3. Set the Root Directory to `smart-project-manager-backend`.
4. Set the build command: `npm install`
5. Set the start command: `node index.js` (or `node server.js`).
6. Add all your Backend `.env` variables in the hosting dashboard.

### smart-project-manager-client Deployment (e.g., Vercel, Netlify)

1. Connect your repository to Vercel/Netlify.
2. Set the Root Directory to `frontend`.
3. Set the Framework Preset to `Vite`.
4. Add your Frontend `.env` variables (`VITE_API_URL` should point to your live deployed backend URL).
5. Click **Deploy**.

---

_Happy Coding! 🚀_
