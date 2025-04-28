export interface AuthServicesProps {
  login: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    data?: { access?: string; refresh?: string };
    error?: Error;
  }>;
  logout: () => void;
  isLoggedIn: boolean;
}
