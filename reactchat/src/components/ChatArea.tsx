import { Box } from "@mui/material";
import ChannelHeader from "./ChannelHeader";

import WelcomeScreen from "./WelcomeScreen";

import { Server, Channel } from "../types/interfaces";
import MessageArea from "./MessageArea";

interface ChatAreaProps {
  selectedServer: Server | null;
  selectedChannel: Channel | null;
}

const ChatArea = ({ selectedServer, selectedChannel }: ChatAreaProps) => {
  const renderContent = () => {
    if (!selectedChannel) {
      return <WelcomeScreen />;
    }
    return <MessageArea selectedChannelId={selectedChannel.id} />;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#36393f",
        flexGrow: 1,
        width: "100%",
      }}
    >
      <ChannelHeader
        selectedChannelId={selectedChannel?.id || null}
        serverName={selectedServer?.name}
        channelName={selectedChannel?.name}
        channelTopic={selectedChannel?.topic}
      />
      {renderContent()}
    </Box>
  );
};

export default ChatArea;
