import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { useNavigate } from "react-router-dom";
import { Channel } from "../types/interfaces";

interface ChannelItemProps {
  channel: Channel;
  serverId: string;
  isSelected: boolean;
  onChannelSelect: () => void;
}

const ChannelItem = ({
  channel,
  serverId,
  isSelected,
  onChannelSelect,
}: ChannelItemProps) => {
  const navigate = useNavigate();

  const handleChannelClick = () => {
    navigate(`/server/${serverId}`);
    onChannelSelect();
  };

  return (
    <ListItemButton
      sx={{
        pl: 4,
        borderRadius: 1,
        mb: 0.5,
        backgroundColor: isSelected ? "#393c43" : "transparent",
        "&:hover": { backgroundColor: "#393c43" },
      }}
      onClick={handleChannelClick}
      selected={isSelected}
    >
      <ListItemIcon sx={{ minWidth: 35, color: "#72767d" }}>
        <TagIcon />
      </ListItemIcon>
      <ListItemText
        primary={channel.topic}
        secondary={channel.name}
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
