
import { Routes, Route, Navigate } from 'react-router-dom';
import { RegistrationPage } from './pages/registration/registrationPage';
import { LoginPage } from './pages/login/loginPage';
import { UserPage } from './pages/user/userPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='register' element={<RegistrationPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='user-home' element={<UserPage />} />
      </Routes>
    </>
  )
}

export default App
