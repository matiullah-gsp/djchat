import { Box, Paper, Avatar, Typography } from "@mui/material";
import { Message } from "../types/interfaces";
import { useEffect, useRef } from "react";
import { useAuthService } from "../services/auth-service";
interface MessageListProps {
  messages: Message[];
}

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch {
    return timestamp;
  }
};

const MessageList = ({ messages }: MessageListProps) => {
  const { currentUser } = useAuthService();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
          {/* No messages yet. Start the conversation! */}
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
        height: "calc(100vh - 140px)",
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
      {messages.map((message, index) => {
        const isCurrentUser =
          currentUser && message.sender === currentUser.username;

        return (
          <Box
            key={message.id}
            sx={{
              display: "flex",
              justifyContent: isCurrentUser ? "flex-end" : "flex-start",
              width: "100%",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: isCurrentUser ? "#3a6ea5" : "#36393f",
                color: "#dcddde",
                maxWidth: "70%",
                borderRadius: isCurrentUser
                  ? "15px 15px 0 15px"
                  : "15px 15px 15px 0",
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  flexDirection: isCurrentUser ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: stringToColor(message.sender),
                    order: isCurrentUser ? 1 : 0,
                  }}
                >
                  {message.sender.charAt(0)}
                </Avatar>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                      justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "#fff" }}
                    >
                      {isCurrentUser ? "You" : message.sender}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  </Box>
                  <Typography variant="body1">{message.content}</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        );
      })}
      <div ref={messagesEndRef} style={{ paddingBottom: "10px" }} />
    </Box>
  );
};

function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  const lightnessOffset = 150;

  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;

    value = Math.min(value + lightnessOffset, 255);

    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export default MessageList;
