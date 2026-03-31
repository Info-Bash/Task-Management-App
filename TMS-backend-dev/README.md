# 🛠️ Backend - Task Management System

This is the backend service for the Task Management System, built with Node.js and Express. It handles authentication, business logic, and efficient data management using MongoDB.

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JSON Web Token (JWT)
* Bcrypt (password hashing)

---

## 🧱 Architecture & Structure

The backend follows a modular and scalable architecture:

```id="p9d3x1"
TMS-backend-dev/
  ├── controllers/   # Request handlers (business logic)
  ├── database/      # MongoDb connection
  ├── middleware/    # Auth & error handling middleware
  ├── models/        # Database schemas (Mongoose)
  ├── routes/        # API route definitions
  └── server.js
```

---

## 🔐 Authentication Flow

Authentication is handled using JWT:

1. User registers or logs in
2. Server validates credentials
3. A JWT token is generated
4. Token is sent to the client
5. Client includes token in requests
6. Middleware verifies token before accessing protected routes

---

## 🛡️ Authorization

* Role-based access control (e.g., User / Admin)
* Middleware ensures only authorized users can perform certain actions

---

## 📄 API Endpoints (Overview)

| Method | Endpoint                         | Description         |
| ------ | -------------------------------- | ------------------- |
| POST   | /api/TMS/auth/register           | Register user       |
| POST   | /api/TMS/auth/login              | Login user          |
| GET    | /api/TMS/user/tasks              | Get user tasks      |
| POST   | /api/TMS/user/create-task        | Create task         |
| PUT    | /api/TMS/user/update-profile/:id | Update user profile |
| PUT    | /api/TMS/admin/update-profile/:id| Update admin profile|
| PATCH  | /api/TMS/user/edit-task/:id      | Update task         |
| DELETE | /api/TMS/user/delete-task/:id    | Delete task         |

---

## 🔎 Filtering & Pagination (Core Feature)

Tasks are fetched using **server-side filtering and pagination** for performance and scalability.

### Example Request

```http id="9y1g8q"
GET /api/TMS/admin/tasks?page&limit=10&search&status=pending
```

### Query Parameters

* `page` → Page number
* `limit` → Number of records per page
* `status` → Filter by task status
* `search` → Search by title/description/@user 

---

## ⚡ Implementation Approach

* Dynamic query object for filtering
* MongoDB `skip()` and `limit()` for pagination
* Efficient data retrieval for large datasets

Example:

```js id="t6c4qp"
const query = {};

if (status) query.status = status;
if (search) {
  query.title = { $regex: search, $options: "i" };
}

const tasks = await Task.find(query)
  .skip((page - 1) * limit)
  .limit(limit);
```

---

## 🧠 Middleware

Custom middleware is used to handle:

* Authentication (JWT verification)
* Authorization (role checks)
* Error handling
* Request validation

---

## 🗄️ Database Design

### Task Model (Example)

```js id="8f7b1d"
{
  title: String,
  desc: String,
  status: String,
  dateCompleted: Date,
  dateVerified: Date,
  owner: mongoose.Schema.Types.ObjectId
}
```

* Each task is linked to a specific user
* Ensures data isolation per user

---

## 🔒 Security Practices

* Password hashing using bcrypt
* Token-based authentication (JWT)
* Protected routes via middleware
* Environment variables for sensitive data

---

## ▶️ Running the Backend

```bash id="z3l2xf"
npm install
npm run dev
```

---

## 🔗 Related Documentation

* [Frontend Documentation](../task-management-system/README.md)
* [Root README](../README.md)
