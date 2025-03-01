const GITHUB_USERNAME_KEY = 'github_username';
import type { GithubStats } from '../constants/github';

export const getStoredUsername = (): string => {
  return localStorage.getItem(GITHUB_USERNAME_KEY) || "";
};

export const setStoredUsername = (username: string): void => {
  localStorage.setItem(GITHUB_USERNAME_KEY, username);
};

export const fetchGithubStats = async (username: string): Promise<GithubStats> => {
  // Cache constants
  const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in ms
  const userCacheKey = `github_user_${username}`;
  const reposCacheKey = `github_repos_${username}`;
  const now = Date.now();
  
  let userData: any;
  let repos: any[] = [];
  let ok = false;
  
  // Try to get data from cache
  let usingCache = false;
  try {
    const userCache = localStorage.getItem(userCacheKey);
    const reposCache = localStorage.getItem(reposCacheKey);
    
    if (userCache && reposCache) {
      const parsedUserCache = JSON.parse(userCache);
      const parsedReposCache = JSON.parse(reposCache);
      
      // Check if cache is still valid
      if (now - parsedUserCache.timestamp < CACHE_EXPIRATION && 
          now - parsedReposCache.timestamp < CACHE_EXPIRATION) {
        userData = parsedUserCache.data;
        repos = parsedReposCache.data;
        usingCache = true;
        console.log("Using cached GitHub data");
      }
    }
  } catch (error) {
    console.error("Cache error:", error);
  }
  
  // If no valid cache, fetch from API
  if (!usingCache) {
    try {
      const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos`)
      ]);
      
      if (!userResponse.ok || !reposResponse.ok) {
      throw new Error('Failed to fetch GitHub data');
      }
      
      userData = await userResponse.json();
      repos = await reposResponse.json();
      ok = true;
    } catch (error) {
      console.error("Error fetching from GitHub API:", error);
      userData = {};
      repos = [];
      ok = false;
    }
    
    // Update cache
    try {
      localStorage.setItem(userCacheKey, JSON.stringify({ data: userData, timestamp: now }));
      localStorage.setItem(reposCacheKey, JSON.stringify({ data: repos, timestamp: now }));
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  }

  // Calculate total stars
  const totalStars = repos.length > 0 ? repos.map(repo => repo.stargazers_count).reduce((a, b) => a + b) : 0;

  // Get total commits (approximation from contribution graph)
  const contributionsResponse = await fetch(
    `https://github-contributions-api.deno.dev/${username}.json`
  );
  const contributionsData = await contributionsResponse.json();
  const totalCommits = contributionsData.total;

  return {
    username: userData.login || "",
    name: userData.name || "",
    avatarUrl: userData.avatar_url || "",
    bio: userData.bio || "",
    followers: userData.followers || 0,
    following: userData.following || 0,
    publicRepos: userData.public_repos || 0,
    totalCommits: totalCommits || 0,
    totalStars: totalStars || 0,
  };
};
