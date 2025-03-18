import { Contest, ContestParamsType, FilterType, PlatformType } from "@/types/contest";
import axios from "axios";
import { getToken } from "./auth";


const DUMMY_CONTESTS = [
    {
        id: 1,
        platform: "codeforces",
        startsAt: new Date(1742048773 * 1000),
        duration: 10800,
        contestTitle: "Codeforces Round #830 (Div. 2)",
    },
    {
        id: 2,
        platform: "codeforces",
        startsAt: new Date(1742148773 * 1000),
        duration: 7200,
        contestTitle: "Codeforces Global Round 25"
    },
    {
        id: 3,
        platform: "codechef",
        startsAt: new Date(1742248773 * 1000),
        duration: 9000,
        contestTitle: "Starters 177 (Rated till 5 star)"
    },
    {
        id: 4,
        platform: "leetcode",
        startsAt: new Date(1742348773 * 1000),
        duration: 5400,
        contestTitle: "Leetcode Weekly Contest 378"
    },
    {
        id: 5,
        platform: "leetcode",
        startsAt: new Date(1742448773 * 1000),
        duration: 6000,
        contestTitle: "Leetcoder Beginner Contest 315"
    },
    {
        id: 6,
        platform: "codeforces",
        startsAt: new Date(1742548773 * 1000),
        duration: 7200,
        contestTitle: "Codeforces Round #831 (Div. 3)"
    },
    {
        id: 7,
        platform: "codechef",
        startsAt: new Date(1742648773 * 1000),
        duration: 10800,
        contestTitle: "Cook-Off 2025"
    },
    {
        id: 8,
        platform: "leetcode",
        startsAt: new Date(1742748773 * 1000),
        duration: 5400,
        contestTitle: "Leetcode Biweekly Contest 115"
    },
    {
        id: 9,
        platform: "leetcoder",
        startsAt: new Date(1742848773 * 1000),
        duration: 7200,
        contestTitle: "Leetcode Biweekly Contest 115"
    },
];

export const getContests = async (offset: number = 0, limit: number = 10, platforms: PlatformType[] = ["CODEFORCES", "CODECHEF", "LEETCODE"], filterType: FilterType = "upcoming", isBookmark = false) => {
    console.log("fetching")
    try {
        const paramsObj: ContestParamsType = {
            offset: String(offset),
            limit: String(limit),
            platforms: platforms.join(','),
            filterType: String(filterType),
        };
        if (isBookmark) {
            paramsObj.isBookmark = String(true);
        }
        const params = new URLSearchParams(paramsObj as unknown as string).toString();

        const options = isBookmark ? {
            headers: { "Authorization": "Bearer " + getToken() }
        } : undefined;
        const res = await fetch(`http://localhost:3000/v1/contests?${params}`, options);

        if (!res.ok) {
            console.log(await res.json());
            throw Error("Failed to get contest");
        }
        const resData = await res.json();
        return {
            offset,
            limit,
            ...resData
        };
    }
    catch (err) {
        console.log(err)
        throw Error("Failed to get contest");
    }

    // return {
    //     offset,
    //     limit,
    //     contests: DUMMY_CONTESTS.filter((contest) => platforms.includes((contest as unknown as Contest).platform))
    // };
}



export const editContestYoutubeUrl = async (contestId: number, youtubeUrl: string) => {
    try {
        const { data } = await axios.post("http://localhost:3000/v1/contest/edit", {
            contestId,
            youtubeUrl
        }, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        });
        
        return data;
    }
    catch (err) {
        throw Error("Failed to update contest");
    }
}  