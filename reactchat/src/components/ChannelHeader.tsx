import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "../services/auth-service";
import { JoinButton } from "./JoinButton";
interface ChannelHeaderProps {
  selectedChannelId: string | null;
  serverName?: string;
  channelName?: string;
  channelTopic?: string;
}

const ChannelHeader = ({
  selectedChannelId,
  serverName,
  channelName,
  channelTopic,
}: ChannelHeaderProps) => {
  const navigate = useNavigate();
  const { logout, isLoggedIn, currentUser } = useAuthService(navigate);
  
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "#36393f",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selectedChannelId ? (
            <>
              <TagIcon sx={{ mr: 1, color: "#72767d" }} />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" noWrap component="div">
                  {channelTopic || "channel-name"}
                </Typography>
                {channelName && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ opacity: 0.7 }}
                    noWrap
                  >
                    {channelName}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ ml: 2, opacity: 0.7 }}
              >
                {serverName ? `${serverName} server` : ""}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" noWrap component="div">
              dChat
            </Typography>
          )}
        </Box>

        <JoinButton />


        {isLoggedIn && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {currentUser && (
              <Typography
                variant="body2"
                sx={{
                  color: "#B9BBBE",
                  fontWeight: 500,
                }}
              >
                {currentUser.username}
              </Typography>
            )}
            <IconButton
              color="primary"
              onClick={handleLogout}
              size="small"
              title="Logout"
              sx={{
                backgroundColor: "#4f545c",
                borderRadius: "4px",
                padding: "8px",
                "&:hover": {
                  backgroundColor: "#3c3f45",
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ChannelHeader;
