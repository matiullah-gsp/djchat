import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
// Create a dark theme for the chat app
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#2f3136",
      paper: "#36393f",
    },
    primary: {
      main: "#7289da",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b9bbbe",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
