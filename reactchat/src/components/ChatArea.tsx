import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ChannelHeader from "./ChannelHeader";

import WelcomeScreen from "./WelcomeScreen";
import LoadingScreen from "./LoadingScreen";
import useCrud from "../hook/useCrud";
import { Server, Channel } from "../types/interfaces";
import MessageArea from "./MessageArea";

interface ChatAreaProps {
  selectedServer: string | null;
  selectedChannel: string | null;
}

const ChatArea = ({ selectedServer, selectedChannel }: ChatAreaProps) => {
  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  const {
    data: servers = [],
    loading,
    getAll,
  } = useCrud<Server[]>({
    apiPath: "servers/select/",
    initialData: [],
  });

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!servers.length) return;

    const server = servers.find((s) => s.id === selectedServer) || null;
    setCurrentServer(server);

    if (server && selectedChannel) {
      const channel =
        server.channel_server.find((c) => c.id === selectedChannel) || null;
      setCurrentChannel(channel);
    } else {
      setCurrentChannel(null);
    }
  }, [selectedServer, selectedChannel, servers]);

  const renderContent = () => {
    if (loading) {
      return <LoadingScreen />;
    }

    if (!selectedChannel) {
      return <WelcomeScreen />;
    }

    return <MessageArea selectedChannel={selectedChannel} />;
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
        selectedChannel={selectedChannel}
        serverName={currentServer?.name}
        channelName={currentChannel?.name}
        channelTopic={currentChannel?.topic}
      />
      {renderContent()}
    </Box>
  );
};

export default ChatArea;
