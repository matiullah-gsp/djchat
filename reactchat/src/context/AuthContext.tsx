import { createContext } from "react";
import { AuthServicesProps } from "../types/auth-service";
import { useAuthService } from "../services/auth-service";

// Create an initial empty state
const initialAuthState: AuthServicesProps = {
  login: async () => ({ success: false, error: new Error("Not implemented") }),
  logout: () => {},
  isLoggedIn: false,
};

const AuthContext = createContext<AuthServicesProps>(initialAuthState);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const authService = useAuthService();

  return (
    <AuthContext.Provider value={authService}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
