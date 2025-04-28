import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Routes from "./Routes";
import AuthProvider from "./providers/AuthProvider";
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
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
