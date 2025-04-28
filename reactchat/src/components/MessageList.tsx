import { Box, Paper, Avatar, Typography } from "@mui/material";
import { Message } from "../types/interfaces";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch {
    return timestamp;
  }
};

const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      ref={scrollContainerRef}
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        height: "calc(100vh - 140px)", // Adjust based on header and input heights
        "&::-webkit-scrollbar": {
          width: "8px",
          backgroundColor: "#2e3136",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#202225",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#32353b",
          },
        },
      }}
    >
      {messages.map((message, index) => (
        <Paper
          key={message.id}
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "#36393f",
            color: "#dcddde",
            width: "100%",
            borderLeft:
              index === messages.length - 1 ? "3px solid #7289da" : "none",
            animation:
              index === messages.length - 1
                ? "fadeIn 0.3s ease-in-out"
                : "none",
            "@keyframes fadeIn": {
              "0%": {
                opacity: 0,
                transform: "translateY(10px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Avatar sx={{ bgcolor: stringToColor(message.sender) }}>
              {message.sender.charAt(0)}
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
                  {message.sender}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formatTimestamp(message.timestamp)}
                </Typography>
              </Box>
              <Typography variant="body1">{message.content}</Typography>
            </Box>
          </Box>
        </Paper>
      ))}
      <div ref={messagesEndRef} style={{ paddingBottom: "10px" }} />
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
