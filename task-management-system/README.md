# 🎨 Frontend - Task Management App

This is the frontend of the Task Management System, built with React. It provides a responsive and interactive user interface for managing tasks, handling authentication, and communicating with the backend API.

---

## ⚛️ Tech Stack

* React (Hooks)
* React Router
* Axios (API requests)
* Bootstrap / CSS Modules
* Zod (schema validation)
* Context API / Local State

---

## 🧱 Architecture & Structure

The frontend follows a modular and scalable structure:

```id="6k2v2z"
src/
├── api/          # API calls
├── assets/
├── components/   # Reusable UI components
├── context/      # Global state (auth, etc.)
├── helpers/      # Business-specific helper functions
├── hooks/        # Custom hooks (form handling, etc.)
├── pages/
├── routes/       # Route definitions & protected routes
├── schemas/      # Zod validation schemas
├── styles/
├── utils/        # Generic reusable utilities
└── App.jsx
```

---

## 🔐 Authentication Flow

* User logs in via form
* JWT token is stored (e.g., localStorage)
* Token is attached to API requests
* Protected routes restrict unauthorized access

---

## 🔄 Routing

Implemented using React Router with protected routes:

```id="zvpxn9"
<Route path="/dashboard" element={<ProtectedRoute />}>
  <Route index element={<Dashboard />} />
</Route>
```

---

## 🧠 State Management

* Local state using `useState`
* Side effects handled with `useEffect`
* Context API 
* Custom hooks used to abstract reusable logic

---

## 🧩 Custom Hooks

Custom hooks are used to abstract reusable logic and keep components clean.

### `useFormHandler`

Handles:

* Form state management
* Input changes
* Validation integration (Zod)
* Touched field tracking
* Error handling

This improves reusability and keeps UI components focused on rendering.

Validation schemas are integrated with custom hooks for a clean separation between form logic and UI.

---

## 🧾 Form Validation (Zod)

Form validation is handled using **Zod schemas** to ensure type-safe and scalable validation logic.

* Centralized validation rules inside the `schemas/` directory
* Reusable schemas across forms
* Clear error handling and validation messages

Example:

```id="3z8f2k"
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  desc: z.string().min(5, "Description must be at least 5 characters"),
});
```

### ✅ Benefits

* Strong validation rules
* Cleaner form logic
* Improved maintainability
* Type safety (especially useful with TypeScript)


## 🌐 API Integration

All API calls are handled using a centralized service layer:

```id="nqg6x8"
axios.get("/api/tasks");
```

* Base URL configured
* Authorization headers attached
* Error handling managed globally

---

## 📄 Key Features

* Dynamic task rendering
* Form handling with validation
* Protected routes
* API-driven UI updates
* Responsive design

---

## ▶️ Running the Frontend

```bash id="7a4n9w"
npm install
npm run dev
```

---

## 🔗 Related Documentation

* [Backend Documentation](../TMS-backend-dev/README.md)
* [Root README](../README.md)
