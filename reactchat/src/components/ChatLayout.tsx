import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import type { Server, Channel } from "../types/interfaces";

const SIDEBAR_WIDTH = 240;

const ChatLayout = () => {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const handleServerSelect = (server: Server) => {
    setSelectedServer(server);
  };

  const handleChannelSelect = (server: Server, channel: Channel) => {
    setSelectedServer(server);
    setSelectedChannel(channel);
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
