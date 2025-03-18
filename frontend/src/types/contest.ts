

export enum Platform {
    CODEFORCES = "CODEFORCES",
    LEETCODE = "LEETCODE",
    CODECHEF = "CODECHEF"
};

export interface Contest {
    id: number;
    platform: Platform;
    startsAt: number;
    duration: number;
    title: string;
    hasEnded?: boolean;
    youtubeUrl?: string;
    url: string;
    isBookmarked: boolean;
    isRunning?: boolean;
}

export type FilterType = "upcoming" | "past" | "all";
export type PlatformType = "CODEFORCES" | "CODECHEF" | "LEETCODE";


export interface ContestParamsType {
    offset: string;
    limit: string;
    platforms: string;
    filterType: string;
    isBookmark?: string;
}