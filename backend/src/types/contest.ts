export enum Platform {
    CODEFORCES = "CODEFORCES",
    LEETCODE = "LEETCODE",
    CODECHEF = "CODECHEF"
};

export interface ContestType {
    title: String;
    url: String;
    youtubeUrl: String;
    platform: Platform;
    startsAt: number;
    duration: number;
    contestTitle: string;
    hasEnded?: boolean;
    isBookmarked: boolean;
    isRunning?: boolean;
}

export type FilterType = "upcoming" | "past" | "all";
export type PlatformType = "CODEFORCES" | "CODECHEF" | "LEETCODE";


export interface MongooseFilter {
    platform?: Object | null;
    startsAt?: Object | null;
}