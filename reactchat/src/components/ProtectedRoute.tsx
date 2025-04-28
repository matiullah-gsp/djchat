import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthService } from "../services/auth-service";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthService(navigate);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
