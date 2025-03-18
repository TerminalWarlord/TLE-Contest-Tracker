

export enum Platform {
    CODEFORCES = "CODEFORCES",
    LEETCODE = "LEETCODE",
    CODECHEF = "CODECHEF"
};

export interface Contest {
    id: number;
    platform: Platform;
    startsAt: Date;
    duration: number;
    contestTitle: string;
    hasEnded?: boolean; 
    isBookmarked: boolean;
    isRunning?: boolean;
}

export type FilterType = "upcoming" | "past" | "all";
export type PlatformType = "CODEFORCES" | "CODECHEF" | "LEETCODE";