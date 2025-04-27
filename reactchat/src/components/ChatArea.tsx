import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ChannelHeader from "./ChannelHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import WelcomeScreen from "./WelcomeScreen";
import LoadingScreen from "./LoadingScreen";
import useCrud from "../hook/useCrud";
import { ChannelMessages, Server, Channel } from "../types/interfaces";
import MessageArea from "./MessageArea";

// Dummy message data - in a real app, this would come from the API
// const dummyMessages: Record<number, ChannelMessages> = {
//   2: {
//     // Channel ID for "developers"
//     messages: [
//       {
//         id: 1,
//         text: "Welcome to the developers chat!",
//         author: "System",
//         timestamp: "2023-07-15 10:00",
//       },
//       {
//         id: 2,
//         text: "Anyone working on a React project?",
//         author: "Alex",
//         timestamp: "2023-07-15 10:05",
//       },
//       {
//         id: 3,
//         text: "I'm building a chat app with React and FastAPI!",
//         author: "Sam",
//         timestamp: "2023-07-15 10:07",
//       },
//     ],
//   },
//   3: {
//     // Channel ID for "techs"
//     messages: [
//       {
//         id: 4,
//         text: "What tech are you all using these days?",
//         author: "System",
//         timestamp: "2023-07-15 11:00",
//       },
//       {
//         id: 5,
//         text: "I'm really enjoying TypeScript with React!",
//         author: "Taylor",
//         timestamp: "2023-07-15 11:30",
//       },
//       {
//         id: 6,
//         text: "Python + FastAPI is my current go-to for backends",
//         author: "Jordan",
//         timestamp: "2023-07-15 11:35",
//       },
//     ],
//   },
// };

interface ChatAreaProps {
  selectedServer: number | null;
  selectedChannel: number | null;
}

const ChatArea = ({ selectedServer, selectedChannel }: ChatAreaProps) => {
  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  // Fetch server data
  const {
    data: servers = [],
    loading,
    getAll,
  } = useCrud<Server[]>({
    apiPath: "servers/select/",
    initialData: [],
  });

  // Fetch data on initial mount
  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update current server and channel when selection or data changes
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
