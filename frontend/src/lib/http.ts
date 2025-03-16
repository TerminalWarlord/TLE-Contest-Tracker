import { Contest, FilterType, PlatformType } from "@/types/contest";
import axios from "axios";


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

export const getContests = async (offset: number = 0, limit: number = 10, platforms: PlatformType[] = ["CODEFORCES", "CODECHEF", "LEETCODE"], filterType: FilterType = "upcoming") => {
    console.log("fetching")
    try {
        const params = new URLSearchParams({
            offset: String(offset),
            limit: String(limit),
            platforms: platforms.join(','), 
            filterType: String(filterType)
        }).toString();

        const res = await fetch(`http://localhost:3000/v1/contests?${params}`);

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


export const getToken = () => {
    const token = localStorage.getItem("token");

    return token;
    // if(!token){}
    // intentionally hard coding this for testing
    // return {
    //     userId: 1,
    //     username: "jaybee",
    //     email: "jaybee@joybiswas.com"
    // }
}





export const getUserDetails = async () => {
    try {
        const { data } = await axios.get("http://localhost:3000/v1/me", {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        // throw Error("User not authenticated");
        return data;
    }
    catch (err) {
        return null;
    }
}