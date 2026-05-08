import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: any) => {
  const isAuthenticated = true; // abhi temporary

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;