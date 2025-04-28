import { useState, useEffect, useRef } from "react";
import { Box, TextField, IconButton, Fade } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput = ({
  onSendMessage,
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() === "" || disabled) return;

    onSendMessage(message);
    setMessage("");
  };

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Handle keyboard shortcuts
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Ctrl+Enter or Command+Enter to send message
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        width: "100%",
        backgroundColor: "#36393f",
        borderTop: "1px solid #26282c",
        transition: "all 0.2s ease-in-out",
        boxShadow: isFocused ? "0 -1px 5px rgba(0, 0, 0, 0.2)" : "none",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={
          disabled ? "Select a channel to send messages" : "Type a message..."
        }
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        inputRef={inputRef}
        InputProps={{
          endAdornment: (
            <Fade in={message.trim().length > 0}>
              <IconButton
                type="submit"
                sx={{
                  color:
                    message.trim() && !disabled ? "#7289da" : "text.disabled",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
                disabled={!message.trim() || disabled}
              >
                <SendIcon />
              </IconButton>
            </Fade>
          ),
          sx: {
            backgroundColor: "#40444b",
            color: "#dcddde",
            borderRadius: "8px",
            padding: "8px 14px",
            transition: "all 0.2s ease-in-out",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7289da",
            },
          },
        }}
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "0.95rem",
          },
        }}
      />
      <Box sx={{ mt: 0.5, display: "flex", justifyContent: "flex-end" }}>
        <Box
          sx={{
            fontSize: "0.7rem",
            color: "#72767d",
            opacity: 0.8,
          }}
        >
          Press Enter to send, Ctrl+Enter for new line
        </Box>
      </Box>
    </Box>
  );
};

export default MessageInput;
