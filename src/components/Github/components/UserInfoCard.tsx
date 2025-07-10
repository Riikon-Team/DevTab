import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Link,
  Grid,
  useTheme,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import type { GitHubUser } from "../../../constants/Githubv2";

interface UserInfoCardProps {
  user: GitHubUser;
  fontSize?: number;
  compactMode?: boolean;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  fontSize = 14,
  compactMode = false,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        background:
          theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.7)" : "rgba(255, 255, 255, 0.7)",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: compactMode ? 1.5 : 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ width: "100%" }}>
          <Grid item>
            <div
              style={{ position: "relative", display: "flex", gap: "10px", alignItems: "center" }}
            >
              <Avatar
                src={user.avatarUrl}
                alt={user.name || user.login}
                sx={{
                  width: compactMode ? 40 : 60,
                  height: compactMode ? 40 : 60,
                  fontSize: compactMode ? "1rem" : "1.5rem",
                }}
              />
              <Box
                sx={{
                  mt: compactMode ? 0.5 : 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  fontWeight="bold"
                  sx={{ fontSize: fontSize + 4 }}
                >
                  {user.name || user.login}
                </Typography>

                <Link
                  href={user.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: fontSize - 1,
                    mb: 1,
                  }}
                >
                  @{user.login}
                </Link>
              </Box>
            </div>
          </Grid>

          <Grid item xs>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  mt: compactMode ? 0.5 : 1,
                  fontSize: fontSize - 1,
                }}
              >
                <Chip
                  icon={<PeopleIcon fontSize="small" />}
                  label={`${user.followers} followers`}
                  size={compactMode ? "small" : "medium"}
                  variant="outlined"
                  sx={{ fontSize: fontSize - 1 }}
                />

                <Chip
                  icon={<PersonIcon fontSize="small" />}
                  label={`${user.following} following`}
                  size={compactMode ? "small" : "medium"}
                  variant="outlined"
                  sx={{ fontSize: fontSize - 1 }}
                />

                <Chip
                  icon={<FolderIcon fontSize="small" />}
                  label={`${user.publicRepos} repositories`}
                  size={compactMode ? "small" : "medium"}
                  variant="outlined"
                  sx={{ fontSize: fontSize - 1 }}
                />

                {user.blog && (
                  <Chip
                    icon={<LanguageIcon fontSize="small" />}
                    label={user.blog}
                    component={Link}
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size={compactMode ? "small" : "medium"}
                    variant="outlined"
                    clickable
                    sx={{ fontSize: fontSize - 1 }}
                  />
                )}

                {user.email && (
                  <Chip
                    icon={<EmailIcon fontSize="small" />}
                    label={user.email}
                    component={Link}
                    href={`mailto:${user.email}`}
                    size={compactMode ? "small" : "medium"}
                    variant="outlined"
                    clickable
                    sx={{ fontSize: fontSize - 1 }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
