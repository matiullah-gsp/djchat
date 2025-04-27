import { Box, Typography } from "@mui/material";

interface WelcomeScreenProps {
  title?: string;
  message?: string;
}

const WelcomeScreen = ({
  title = "Welcome to dChat!",
  message = "Select a server and channel from the sidebar to start chatting.",
}: WelcomeScreenProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default WelcomeScreen;
