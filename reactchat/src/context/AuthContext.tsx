import { createContext } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (newToken: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});



export default AuthContext;
