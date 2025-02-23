const GITHUB_USERNAME_KEY = 'github_username';
import type { GithubStats } from '../constants/github';

export const getStoredUsername = (): string => {
  return localStorage.getItem(GITHUB_USERNAME_KEY) || 'konnn04';
};

export const setStoredUsername = (username: string): void => {
  localStorage.setItem(GITHUB_USERNAME_KEY, username);
};

export const fetchGithubStats = async (username: string): Promise<GithubStats> => {
  const [userResponse, reposResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos`)
  ]);

  const userData = await userResponse.json();
  const repos = await reposResponse.json();

  // Calculate total stars
  const totalStars = repos.reduce((acc: number, repo: any) => 
    acc + repo.stargazers_count, 0);

  // Get total commits (approximation from contribution graph)
  const contributionsResponse = await fetch(
    `https://github-contributions-api.deno.dev/${username}.json`
  );
  const contributionsData = await contributionsResponse.json();
  const totalCommits = contributionsData.total;

  return {
    username: userData.login,
    name: userData.name,
    avatarUrl: userData.avatar_url,
    bio: userData.bio,
    followers: userData.followers,
    following: userData.following,
    publicRepos: userData.public_repos,
    totalCommits,
    totalStars
  };
};