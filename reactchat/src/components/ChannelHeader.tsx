import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";

interface ChannelHeaderProps {
  selectedChannel: number | null;
  serverName?: string;
  channelName?: string;
  channelTopic?: string;
}

const ChannelHeader = ({
  selectedChannel,
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
        {selectedChannel ? (
          <>
            <TagIcon sx={{ mr: 1, color: "#72767d" }} />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" noWrap component="div">
                {channelName || "channel-name"}
              </Typography>
              {channelTopic && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ opacity: 0.7 }}
                  noWrap
                >
                  {channelTopic}
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
