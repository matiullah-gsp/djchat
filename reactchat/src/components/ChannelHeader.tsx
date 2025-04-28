import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthService } from "../services/auth-service";

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
  const { logout, isLoggedIn } = useAuthService(navigate);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
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

        {isLoggedIn && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {username && (
              <Typography
                variant="body2"
                sx={{
                  color: "#B9BBBE",
                  fontWeight: 500,
                }}
              >
                {username}
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
