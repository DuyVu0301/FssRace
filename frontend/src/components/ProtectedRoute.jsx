import { Navigate } from "react-router-dom";
import authStore from "../store/authStore";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = authStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
