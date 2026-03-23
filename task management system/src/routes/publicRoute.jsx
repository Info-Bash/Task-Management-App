import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // redirect based on role
    return user.role === "admin"
      ? <Navigate to="/admin-dashboard" replace />
      : <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

export default PublicRoute;