import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Alert, useTheme } from "@mui/material";
import UserInfoCard from "./components/UserInfoCard";
import LanguageStats from "./components/LanguageStats";
import GitHubStats from "./components/GitHubStats";
import CommitActivity from "./components/CommitActivity";
import { useGithubSettings } from "../../hooks/useSettings";
import { type GitHubData } from "../../constants/Githubv2";
import { PROXY } from "../../constants/SearchEngine";
import "./Githubv2.css";

const Githubv2: React.FC = React.memo(() => {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { githubSettings, updateGithubSettings } = useGithubSettings();
  const theme = useTheme();

  // Ensure settings always have default values
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
      // Save username to localStorage for future use
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

        // Check cache first
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

        // If no cache or cache expired, call API
        const apiUrl = `https://profile-summary-for-github.com/api/user/${settings.username}`;
        const response = await fetch(PROXY ? `${PROXY}${encodeURIComponent(apiUrl)}` : apiUrl);

        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const freshData = await response.json();
        freshData.cachedAt = Date.now(); // Add cache timestamp

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

  // Ensure repoCommitCount is Record<string, number>
  const repoCommitCountNumber: Record<string, number> = Object.fromEntries(
    Object.entries(data.repoCommitCount || {}).map(([k, v]) => [k, typeof v === 'number' ? v : Number(v)])
  );

  return (
    <Box
      className={`github-container ${settings.compactMode ? "compact" : ""}`}
      sx={{
        padding: settings.compactMode ? 1 : 1.5,
        borderRadius: 2,
        backgroundColor: settings.backgroundTransparent ? "rgba(255,255,255,0.05)" : theme.palette.background.paper,
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
        "& .MuiCard-root": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: settings.compactMode ? 1 : 2 }}>
        {settings.showUserInfo && (
          <Box sx={{ width: "100%", mb: settings.compactMode ? 1 : 2 }}>
            <UserInfoCard
              user={data.user}
              fontSize={settings.fontSize}
              compactMode={settings.compactMode}
            />
          </Box>
        )}
        {settings.showLanguageStats && (
          <Box sx={{ width: "100%", mb: settings.compactMode ? 1 : 2 }}>
            <LanguageStats
              langData={{
                repoCount: data.langRepoCount,
                starCount: data.langStarCount,
                commitCount: data.langCommitCount,
              }}
              excludedLanguages={settings.excludedLanguages}
              chartHeight={settings.chartSize}
              fontSize={settings.fontSize}
              compactMode={settings.compactMode}
            />
          </Box>
        )}
        {settings.showStats && (
          <Box sx={{ width: "100%", mb: settings.compactMode ? 1 : 2 }}>
            <GitHubStats
              user={data.user}
              repoStarCount={data.repoStarCount}
              repoCommitCount={repoCommitCountNumber}
              fontSize={settings.fontSize}
              compactMode={settings.compactMode}
            />
          </Box>
        )}
        {settings.showCommitActivity && (
          <Box sx={{ width: "100%", mt: settings.compactMode ? 1 : 2 }}>
            <CommitActivity
              commitData={data.quarterCommitCount}
              chartHeight={settings.chartSize * 0.7}
              fontSize={settings.fontSize}
              compactMode={settings.compactMode}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
});

export default Githubv2;
