

export enum Platform {
    codeforces = "codeforces",
    leetcode = "leetcode",
    codechef = "codechef"
};

export interface Contest {
    id: number;
    platform: Platform;
    startsAt: Date;
    duration: number;
    contestTitle: string
}