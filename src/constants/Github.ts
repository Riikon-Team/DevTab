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

export interface LanguageDetail {
    type: 'programming' | 'markup' | 'data' | 'prose' | string;
    language_id: number;
    color?: string;

    // List extension
    extensions?: string[];

    // Alias for languate
    aliases?: string[];

    filenames?: string[];

    tm_scope: string;
    ace_mode: string;

    //Other required attr
    group?: string;
    interpreters?: string[];
    wrap?: boolean;
    codemirror_mode?: string;
    codemirror_mime_type?: string;
    //Other attr
    [key: string]: any;
}

export interface GithubLanguageMap {
    [languageName: string]: LanguageDetail;
}