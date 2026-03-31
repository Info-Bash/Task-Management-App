
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './routes/publicRoute';
import ProtectedRoute from './routes/protectedRoute';
import { RegistrationPage } from './pages/registration/registrationPage';
import { LoginPage } from './pages/login/loginPage';
import { UserPage } from './pages/user/userPage';
import { TaskLayout } from './pages/taskDisplay/taskLayout';
import { EditTask } from './pages/taskDisplay/editTask';
import { ViewTask } from './pages/taskDisplay/viewTask';
//import { ViewTask } from './pages/viewTask';
import AdminPage from './pages/admin/adminpage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

function App() {

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
              <UserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="task/:id"
          element={
            <ProtectedRoute>
              <TaskLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="view" replace />}/>
          <Route path='view' element={<ViewTask />} />
          <Route path='edit' element={<EditTask />}/>
        </Route>

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
