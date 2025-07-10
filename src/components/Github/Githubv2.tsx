import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, Alert, useTheme } from "@mui/material";
import UserInfoCard from "./components/UserInfoCard";
import LanguageStats from "./components/LanguageStats";
import GitHubStats from "./components/GitHubStats";
import CommitActivity from "./components/CommitActivity";
import { useGithubSettings } from "../../hooks/useSettings";
import { type GitHubData } from "../../constants/Githubv2";
import { PROXY } from "../../constants/SearchEngine";
import "./Githubv2.css";

const Githubv2: React.FC = () => {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { githubSettings, updateGithubSettings } = useGithubSettings();
  const theme = useTheme();

  // Đảm bảo các giá trị settings luôn có giá trị mặc định
  const settings = {
    username: githubSettings?.username || "",
    showUserInfo: githubSettings?.showUserInfo === false ? false : true,
    showLanguageStats: githubSettings?.showLanguageStats === false ? false : true,
    showStats: githubSettings?.showStats === false ? false : true,
    showCommitActivity: githubSettings?.showCommitActivity === false ? false : true,
    cacheDurationMinutes: githubSettings?.cacheDurationMinutes || 10,
    excludedLanguages: githubSettings?.excludedLanguages || [],
    fontSize: githubSettings?.fontSize || 14,
    compactMode: githubSettings?.compactMode || false,
    chartSize: githubSettings?.chartSize || 250,
    blur: githubSettings?.blur || 10,
    backgroundTransparent: githubSettings?.backgroundTransparent ?? true,
  };

  useEffect(() => {
    if (!settings.username) {
      const storedUsername = localStorage.getItem("github_username");
      if (storedUsername) {
        console.log("Found username in localStorage:", storedUsername);
        if (githubSettings) {
          updateGithubSettings({ username: storedUsername });
        }
      }
    } else {
      // Lưu username vào localStorage để dùng sau này
      localStorage.setItem("github_username", settings.username);
    }
  }, [githubSettings]);

  useEffect(() => {
    const fetchGitHubData = async () => {
      if (!settings.username) {
        setError("GitHub username not set. Please configure in settings.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Kiểm tra cache trước
        const cachedData = localStorage.getItem(`github_data_${settings.username}`);

        if (cachedData) {
          const parsedData = JSON.parse(cachedData) as GitHubData;
          const now = Date.now();
          const cacheTime = parsedData.cachedAt || 0;
          const cacheAgeMinutes = (now - cacheTime) / (1000 * 60);

          if (cacheAgeMinutes < settings.cacheDurationMinutes) {
            setData(parsedData);
            setLoading(false);
            return;
          }
        }

        // Nếu không có cache hoặc cache hết hạn, gọi API
        const apiUrl = `https://profile-summary-for-github.com/api/user/${settings.username}`;
        const response = await fetch(PROXY ? `${PROXY}${encodeURIComponent(apiUrl)}` : apiUrl);

        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const freshData = await response.json();
        freshData.cachedAt = Date.now(); // Thêm timestamp cache

        localStorage.setItem(`github_data_${settings.username}`, JSON.stringify(freshData));

        setData(freshData);
        setError(null);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError(
          `Failed to load GitHub data for "${settings.username}". Please check the username and try again.`
        );
      } finally {
        setLoading(false);
      }
    };

    if (settings.username) {
      fetchGitHubData();
    }
  }, [settings.username, settings.cacheDurationMinutes]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          p: 1,
          fontSize: settings.fontSize,
        }}
      >
        <CircularProgress size={24} />
        <Box sx={{ ml: 1 }}>Loading GitHub data...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          fontSize: settings.fontSize - 2,
          p: 1,
          "& .MuiAlert-icon": { fontSize: settings.fontSize + 4 },
        }}
      >
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert
        severity="info"
        sx={{
          fontSize: settings.fontSize - 2,
          p: 1,
        }}
      >
        No GitHub data available.
      </Alert>
    );
  }

  if (!githubSettings?.enable) return null;

  return (
    <Box
      className={`github-container ${settings.compactMode ? "compact" : ""}`}
      sx={{
        padding: settings.compactMode ? 1 : 1.5,
        borderRadius: 2,
        background: settings.backgroundTransparent,
        backdropFilter: settings.backgroundTransparent ? `blur(${settings.blur}px)` : "none",
        fontSize: settings.fontSize,
        maxWidth: settings.compactMode ? "900px" : "1100px",
        width: "100%", 
        margin: "0 auto",
        "& .MuiTypography-root": {
          fontSize: `${settings.fontSize}px !important`,
        },
        "& .MuiTypography-body2": {
          fontSize: `${settings.fontSize - 2}px !important`,
        },
        "& .MuiTypography-h6": {
          fontSize: `${settings.fontSize + 2}px !important`,
        },
        "& .MuiCardContent-root": {
          padding: settings.compactMode ? "8px !important" : "16px",
        },
        "& .MuiGrid-container": {
          width: "100%",
          margin: 0,
        },
        "& .MuiGrid-root": {
          width: "100%",
        },
        "& .MuiGrid-item": {
          paddingLeft: settings.compactMode ? 1 : 1.5,
          paddingRight: settings.compactMode ? 1 : 1.5,
        },
        "& .MuiCard-root": {
          backgroundColor: theme.palette.background.transparent,  
        },
      }}
    >
      <Grid container spacing={settings.compactMode ? 1 : 1.5} sx={{ width: "100%", m: 0 }}>
        {settings.showUserInfo && (
          <Grid item xs={12}>
            <UserInfoCard
              user={data.user}
              fontSize={settings.fontSize}
              compactMode={settings.compactMode}
            />
          </Grid>
        )}

        <Grid container item xs={12} spacing={settings.compactMode ? 1 : 1.5}>
          {settings.showLanguageStats && (
            <Grid item xs={12} md={settings.compactMode ? 12 : 6}>
              <LanguageStats
                langData={{
                  repoCount: data.langRepoCount,
                  starCount: data.langStarCount,
                  commitCount: data.langCommitCount,
                }}
                excludedLanguages={settings.excludedLanguages}
                chartHeight={settings.chartSize} // Giữ nguyên chart height để đủ không gian
                fontSize={settings.fontSize}
                compactMode={settings.compactMode}
              />
            </Grid>
          )}

          {settings.showStats && (
            <Grid item xs={12} md={settings.compactMode ? 12 : 6}>
              <GitHubStats
                user={data.user}
                repoStarCount={data.repoStarCount}
                repoCommitCount={data.repoCommitCount}
                fontSize={settings.fontSize}
                compactMode={settings.compactMode}
              />
            </Grid>
          )}
        </Grid>

        {settings.showCommitActivity && (
          <Grid item xs={12}>
            <CommitActivity
              commitData={data.quarterCommitCount}
              chartHeight={settings.chartSize * 0.7}
              fontSize={settings.fontSize}
              compactMode={settings.compactMode}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Githubv2;
