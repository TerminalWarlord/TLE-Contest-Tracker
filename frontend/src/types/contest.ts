

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
}

export type FilterType = "upcoming" | "past";
export type PlatformType = "CODEFORCES" | "CODECHEF" | "LEETCODE";