import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import Server from "./pages/Server";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/server",
    element: <Server />,
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
