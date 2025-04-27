import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { Channel } from "../types/interfaces";

interface ChannelItemProps {
  channel: Channel;
  serverId: number;
  isSelected: boolean;
  onChannelSelect: (serverId: number, channelId: number) => void;
}

const ChannelItem = ({
  channel,
  serverId,
  isSelected,
  onChannelSelect,
}: ChannelItemProps) => {
  return (
    <ListItemButton
      sx={{
        pl: 4,
        borderRadius: 1,
        mb: 0.5,
        backgroundColor: isSelected ? "#393c43" : "transparent",
        "&:hover": { backgroundColor: "#393c43" },
      }}
      onClick={() => onChannelSelect(serverId, channel.id)}
      selected={isSelected}
    >
      <ListItemIcon sx={{ minWidth: 35, color: "#72767d" }}>
        <TagIcon />
      </ListItemIcon>
      <ListItemText
        primary={channel.name}
        secondary={channel.topic}
        primaryTypographyProps={{
          sx: {
            color: isSelected ? "#fff" : "#8e9297",
          },
        }}
        secondaryTypographyProps={{
          sx: {
            color: "#72767d",
            fontSize: "0.75rem",
          },
        }}
      />
    </ListItemButton>
  );
};

export default ChannelItem;
