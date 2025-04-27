import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
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

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() === "" || disabled) return;

    onSendMessage(message);
    setMessage("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={
          disabled ? "Select a channel to send messages" : "Type a message..."
        }
        value={message}
        onChange={handleMessageChange}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <IconButton
              type="submit"
              sx={{
                color:
                  message.trim() && !disabled ? "#7289da" : "text.disabled",
              }}
              disabled={!message.trim() || disabled}
            >
              <SendIcon />
            </IconButton>
          ),
          sx: {
            backgroundColor: "#40444b",
            color: "#dcddde",
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
      />
    </Box>
  );
};

export default MessageInput;
