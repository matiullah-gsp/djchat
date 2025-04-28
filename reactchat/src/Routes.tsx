import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useAuthService } from "./services/auth-service";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthService(navigate);

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
      />

      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        {/* Add more protected routes here */}
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
