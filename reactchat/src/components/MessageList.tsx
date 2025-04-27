import { Box, Paper, Avatar, Typography } from "@mui/material";
import { Message } from "../types/interfaces";

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No messages yet. Start the conversation!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      {messages.map((message) => (
        <Paper
          key={message.id}
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "#36393f",
            color: "#dcddde",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Avatar sx={{ bgcolor: stringToColor(message.author) }}>
              {message.author.charAt(0)}
            </Avatar>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  {message.author}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {message.timestamp}
                </Typography>
              </Box>
              <Typography variant="body1">{message.text}</Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

// Utility function to generate consistent colors for avatars
function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export default MessageList;
