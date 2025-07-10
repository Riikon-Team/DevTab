export interface GitHubUser {
  hireable: boolean;
  followers: number;
  following: number;
  publicRepos: number;
  avatarUrl: string;
  blog: string;
  email: string;
  htmlUrl: string;
  login: string;
  name: string;
}

export interface GitHubData {
  user: GitHubUser;
  quarterCommitCount: Record<string, number>;
  langRepoCount: Record<string, number>;
  langStarCount: Record<string, number>;
  langCommitCount: Record<string, number>;
  repoCommitCount: Record<string, string>;
  repoStarCount: Record<string, number>;
  repoCommitCountDescriptions: Record<string, string>;
  repoStarCountDescriptions: Record<string, string>;
  cachedAt?: number;
}