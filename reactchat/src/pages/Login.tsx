import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuthService } from "../services/auth-service";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuthService(navigate);

  // Use useEffect for redirection instead of conditional rendering
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters"),
      password: Yup.string()
        .required("Password is required")
        .min(4, "Password must be at least 4 characters"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await login(values.username, values.password);

        if (!response.success) {
          setError("Invalid username or password");
        }
        // Navigation will happen automatically through the useEffect above
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || "An error occurred during login");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // If already logged in, don't render the form
  if (isLoggedIn) {
    return null;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#36393f",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              color: "#fff",
              mb: 3,
              fontWeight: "bold",
            }}
          >
            Welcome Back
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mb: 2,
                backgroundColor: "rgba(255, 0, 0, 0.1)",
                color: "#ff4444",
                "& .MuiAlert-icon": {
                  color: "#ff4444",
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              fullWidth
              id="username"
              name="username"
              label="Username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              disabled={isLoading}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: "#dcddde",
                  backgroundColor: "#40444b",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "#7289da",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#7289da",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#72767d",
                  "&.Mui-focused": {
                    color: "#7289da",
                  },
                },
                "& .MuiFormHelperText-root": {
                  color: "#ff4444",
                },
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              disabled={isLoading}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  color: "#dcddde",
                  backgroundColor: "#40444b",
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "#7289da",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#7289da",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#72767d",
                  "&.Mui-focused": {
                    color: "#7289da",
                  },
                },
                "& .MuiFormHelperText-root": {
                  color: "#ff4444",
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                backgroundColor: "#7289da",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#677bc4",
                },
                "&:disabled": {
                  backgroundColor: "#40444b",
                  color: "#72767d",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Sign In"
              )}
            </Button>

            <Typography
              variant="body2"
              sx={{
                color: "#72767d",
                textAlign: "center",
                "& a": {
                  color: "#7289da",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
              }}
            >
              Don't have an account?{" "}
              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Sign up
              </a>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
