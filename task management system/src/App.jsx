
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from "react";
import PublicRoute from './routes/publicRoute';
import ProtectedRoute from './routes/protectedRoute';
import { RegistrationPage } from './pages/registration/registrationPage';
import { LoginPage } from './pages/login/loginPage';
import { UserPage } from './pages/user/userPage';
import { ViewTask } from './pages/viewTask';
import AdminPage from './pages/admin/adminpage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />

        <Route
          path='register'
          element={
            <PublicRoute>
              <RegistrationPage />
            </PublicRoute>
          }
        />

        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserPage tasks={tasks} setTasks={setTasks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="view-task/:id"
          element={
            <ProtectedRoute>
              <ViewTask />
            </ProtectedRoute>
          }
        />

        <Route path='admin-dashboard' element={
          <ProtectedRoute allowedRoles={["admin"]} >
            <AdminPage />
          </ProtectedRoute>
        }
        />
      </Routes>
    </>
  )
};

export default App;
