import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Box, CircularProgress } from "@mui/material";
import { useChatService } from "../services/chat-service";

const MessageArea = ({ selectedChannelId }: { selectedChannelId: string }) => {
  const { messages, loading, sendMessage } = useChatService({
    selectedChannelId,
  });

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 140px)",
            width: "100%",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#7289da" }} />
        </Box>
      ) : (
        <MessageList messages={messages} />
      )}
      <MessageInput onSendMessage={sendMessage} />
    </>
  );
};

export default MessageArea;
