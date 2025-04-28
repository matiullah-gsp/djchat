import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  List,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ServerItem from "./ServerItem";
import LoadingScreen from "./LoadingScreen";
import useCrud from "../hook/useCrud";
import type { Server, Channel } from "../types/interfaces";

interface SidebarProps {
  width: number;
  selectedServer: Server | null;
  selectedChannel: Channel | null;
  onServerSelect: (server: Server) => void;
  onChannelSelect: (server: Server, channel: Channel) => void;
}

const Sidebar = ({
  width,
  selectedServer,
  selectedChannel,
  onServerSelect,
  onChannelSelect,
}: SidebarProps) => {
  const [expandedServers, setExpandedServers] = useState<
    Record<string, boolean>
  >({});
  const [servers, setServers] = useState<Server[]>([]);

  // Use useCrud directly in the component
  const {
    // data: servers = [],
    loading,
    getAll,
  } = useCrud<Server[]>({
    apiPath: "servers/",
    initialData: [],
  });

  // Fetch data only once on component mount
  useEffect(() => {
    getAll().then((data) => {
      setServers(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-expand the first server if there's data and no server is selected
  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
      setExpandedServers((prev) => ({ ...prev, [servers[0].id]: true }));
    }
  }, [servers, selectedServer]);

  const handleServerSelect = (server: Server) => {
    onServerSelect(server);
  };

  const handleChannelSelect = (server: Server, channel: Channel) => {
    onChannelSelect(server, channel);
  };

  const toggleServerExpanded = (server: Server) => {
    setExpandedServers((prev) => ({
      ...prev,
      [server.id]: !prev[server.id],
    }));
  };

  const handleRefresh = () => {
    getAll().then((data) => {
      setServers(data);
    });
  };

  if (loading && servers.length === 0) {
    return (
      <Box
        sx={{
          width,
          height: "100%",
          backgroundColor: "#2f3136",
          color: "#fff",
          borderRight: "1px solid #202225",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
            dChat
          </Typography>
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{ color: "#8e9297" }}
            title="Refresh servers"
            disabled={loading}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: "#40444b" }} />
        <LoadingScreen message="Loading servers..." />
      </Box>
    );
  }

  if (!servers.length) {
    return (
      <Box
        sx={{
          width,
          height: "100%",
          backgroundColor: "#2f3136",
          color: "#fff",
          borderRight: "1px solid #202225",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
            dChat
          </Typography>
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{ color: "#8e9297" }}
            title="Refresh servers"
            disabled={loading}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: "#40444b", width: "100%" }} />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ color: "#8e9297", mb: 2 }}>
            No servers available
          </Typography>

          <Button
            startIcon={<RefreshIcon />}
            variant="outlined"
            onClick={handleRefresh}
            sx={{ color: "#7289da", borderColor: "#7289da" }}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        height: "100%",
        backgroundColor: "#2f3136",
        color: "#fff",
        borderRight: "1px solid #202225",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
          dChat
        </Typography>
        <IconButton
          size="small"
          onClick={handleRefresh}
          sx={{ color: "#8e9297" }}
          title="Refresh servers"
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider sx={{ backgroundColor: "#40444b" }} />

      <List component="nav" sx={{ p: 1 }}>
        {servers.map((server) => (
          <ServerItem
            key={server.id}
            server={server}
            isExpanded={!!expandedServers[server.id]}
            selectedServer={selectedServer}
            selectedChannel={selectedChannel}
            onServerSelect={handleServerSelect}
            onChannelSelect={handleChannelSelect}
            onToggleExpand={toggleServerExpanded}
          />
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
