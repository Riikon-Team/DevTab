import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Link,
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
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={user.avatarUrl}
            alt={user.name || user.login}
            sx={{
              width: compactMode ? 40 : 60,
              height: compactMode ? 40 : 60,
              fontSize: compactMode ? "1rem" : "1.5rem",
            }}
          />
          <Box>
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
                color: theme.palette.primary.main,
              }}
            >
              @{user.login}
            </Link>
          </Box>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PeopleIcon fontSize="small" />
            <Typography sx={{ fontSize: fontSize }}>
              {user.followers} followers
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" />
            <Typography sx={{ fontSize: fontSize }}>
              {user.following} following
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <FolderIcon fontSize="small" />
            <Typography sx={{ fontSize: fontSize }}>
              {user.publicRepos} repositories
            </Typography>
          </Box>
          {user.blog && (
            <Box display="flex" alignItems="center" gap={1}>
              <LanguageIcon fontSize="small" />
              <Link
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{ fontSize: fontSize }}
              >
                {user.blog}
              </Link>
            </Box>
          )}
          {user.email && (
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon fontSize="small" />
              <Link
                href={`mailto:${user.email}`}
                underline="hover"
                sx={{ fontSize: fontSize }}
              >
                {user.email}
              </Link>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
