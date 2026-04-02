# 🗂️ Task Management System

A full-stack task management application built to handle real-world usage with scalable backend architecture, server-side data handling, and secure authentication.

---

## 🚀 Overview

This application allows users to efficiently manage tasks with features like authentication, role-based access control, and optimized data fetching using **server-side filtering and pagination**.

It is designed with a clear separation of concerns between the frontend and backend, following best practices used in modern web applications.

---

## ✨ Key Features

* 🔐 JWT-based Authentication & Authorization
* 👤 Role-based access control (User / Admin)
* ✅ Full CRUD operations for tasks
* 📋 Task status management (pending, completed and Verified)
* 🔎 **Server-side filtering (status, search queries)**
* 📄 **Server-side pagination (efficient large dataset handling)**
* ⚡ Optimized API performance
* 🛡️ Protected routes (frontend & backend)
* 🎯 User-specific task isolation

---

## 🧱 Architecture

This project follows a **client-server architecture**:

```id="r2p0ak"
client (React)  →  API (Express)  →  Database (MongoDB)
```

* The **frontend** handles UI, routing, and state management
* The **backend** manages business logic, authentication, and database queries
* Communication is done via REST APIs

---

## 📚 Project Documentation

* 🔵 [Frontend Documentation](./task-management-system/README.md)
* 🟢 [Backend Documentation](./TMS-backend-dev/README.md)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash id="j3z6df"
git clone https://github.com/your-username/task-management-app.git
cd task-management-app
```

---

### 2. Install dependencies

```bash id="9t4gxh"
# Install backend dependencies
cd TMS-backend-dev
npm install

# Install frontend dependencies
cd ../task management system
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the `server` folder:

```env id="7m1nzd"
PORT=3000
DBASEURI=your_mongodb_connection_string 
JWT_SECRET_KEY=your_secret_key
```

---

### 4. Run the application

```bash id="qojv9v"
# Start backend
cd server
npm run dev

# Start frontend (in another terminal)
cd client
npm run dev
```

---

## 🔑 API Example

Fetch tasks with filtering and pagination:

```http id="g5a2yt"
GET /api/tasks?page=1&limit=10&status=completed&search=meeting
```

---

## 🧠 Technical Highlights

* Implements **server-side pagination** using `skip` and `limit`
* Uses **dynamic query building** for flexible filtering
* Secure password handling with hashing
* Token-based authentication using JWT
* Clean separation of concerns (controllers, routes, middleware)

---

## 🧪 Future Improvements

* 📅 Task deadlines & reminders
* 📊 Analytics dashboard
* 🔔 Real-time updates (WebSockets)
* 🌐 CI/CD deployment pipeline

---

## 📸 Screenshots

<p align="center">
  <img src="./assets/User (Registration).png" width="600"/>
  <br/>
  <em>Registration View</em>
</p>

<p align="center">
  <img src="./assets/User (Login).png" width="600"/>
  <br/>
  <em>Login View</em>
</p>

<p align="center">
  <img src="./assets/User (Dashboard).png" width="600"/>
  <br/>
  <em>Dashboard View</em>
</p>

---

## 🌍 Live Demo

https://task-management-app-kappa-gold.vercel.app

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Bashir**

* GitHub: https://github.com/Info-Bash

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!