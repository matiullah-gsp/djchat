import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";

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
      <Toolbar>
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
      </Toolbar>
    </AppBar>
  );
};

export default ChannelHeader;
