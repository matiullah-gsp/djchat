import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Box,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ForumIcon from "@mui/icons-material/Forum";
import ChannelItem from "./ChannelItem";
import type { Server, Channel } from "../types/interfaces";

interface ServerItemProps {
  server: Server;
  isExpanded: boolean;
  selectedServer: Server | null;
  selectedChannel: Channel | null;
  onServerSelect: (server: Server) => void;
  onChannelSelect: (server: Server, channel: Channel) => void;
  onToggleExpand: (server: Server) => void;
}

const ServerItem = ({
  server,
  isExpanded,
  selectedServer,
  selectedChannel,
  onServerSelect,
  onChannelSelect,
  onToggleExpand,
}: ServerItemProps) => {
  const handleServerClick = () => {
    onToggleExpand(server);
    onServerSelect(server);
  };

  const hasChannels = server.channels && server.channels.length > 0;

  return (
    <Box>
      <ListItemButton
        onClick={handleServerClick}
        selected={selectedServer?.id === server.id}
        sx={{
          borderRadius: 1,
          mb: 0.5,
          backgroundColor:
            selectedServer?.id === server.id ? "#393c43" : "transparent",
          "&:hover": { backgroundColor: "#393c43" },
        }}
      >
        <ListItemIcon sx={{ minWidth: 35, color: "#fff" }}>
          <ForumIcon />
        </ListItemIcon>
        <ListItemText
          primary={server.name}
          secondary={server.category}
          primaryTypographyProps={{
            sx: { color: "#fff" },
          }}
          secondaryTypographyProps={{
            sx: { color: "#8e9297", fontSize: "0.75rem" },
          }}
        />
        {hasChannels ? isExpanded ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>

      {hasChannels && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {server.channels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                serverId={server.id}
                isSelected={
                  selectedServer?.id === server.id &&
                  selectedChannel?.id === channel.id
                }
                onChannelSelect={() => onChannelSelect(server, channel)}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

export default ServerItem;
