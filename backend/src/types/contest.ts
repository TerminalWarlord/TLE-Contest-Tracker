

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
}

export type FilterType = "upcoming" | "past";
export type PlatformType = "CODEFORCES" | "CODECHEF" | "LEETCODE";