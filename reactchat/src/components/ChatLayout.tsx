import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

const SIDEBAR_WIDTH = 240;

const ChatLayout = () => {
  const [selectedServer, setSelectedServer] = useState<number | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);

  const handleServerSelect = (serverId: number) => {
    setSelectedServer(serverId);
  };

  const handleChannelSelect = (serverId: number, channelId: number) => {
    setSelectedServer(serverId);
    setSelectedChannel(channelId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
        <Sidebar
          width={SIDEBAR_WIDTH}
          selectedServer={selectedServer}
          selectedChannel={selectedChannel}
          onServerSelect={handleServerSelect}
          onChannelSelect={handleChannelSelect}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        }}
      >
        <ChatArea
          selectedServer={selectedServer}
          selectedChannel={selectedChannel}
        />
      </Box>
    </Box>
  );
};

export default ChatLayout;
