


const DUMMY_CONTESTS = [
    {
        id: 1,
        platform: "Codeforces",
        startsAt: new Date(1742048773 * 1000),
        duration: 10800,
        contestTitle: "Codeforces Round #830 (Div. 2)"
    },
    {
        id: 2,
        platform: "Codeforces",
        startsAt: new Date(1742148773 * 1000),
        duration: 7200,
        contestTitle: "Codeforces Global Round 25"
    },
    {
        id: 3,
        platform: "Codechef",
        startsAt: new Date(1742248773 * 1000),
        duration: 9000,
        contestTitle: "Starters 177 (Rated till 5 star)"
    },
    {
        id: 4,
        platform: "Leetcode",
        startsAt: new Date(1742348773 * 1000),
        duration: 5400,
        contestTitle: "Leetcode Weekly Contest 378"
    },
    {
        id: 5,
        platform: "Atcoder",
        startsAt: new Date(1742448773 * 1000),
        duration: 6000,
        contestTitle: "Atcoder Beginner Contest 315"
    },
    {
        id: 6,
        platform: "Codeforces",
        startsAt: new Date(1742548773 * 1000),
        duration: 7200,
        contestTitle: "Codeforces Round #831 (Div. 3)"
    },
    {
        id: 7,
        platform: "Codechef",
        startsAt: new Date(1742648773 * 1000),
        duration: 10800,
        contestTitle: "Cook-Off 2025"
    },
    {
        id: 8,
        platform: "Leetcode",
        startsAt: new Date(1742748773 * 1000),
        duration: 5400,
        contestTitle: "Leetcode Biweekly Contest 115"
    },
    {
        id: 9,
        platform: "Atcoder",
        startsAt: new Date(1742848773 * 1000),
        duration: 7200,
        contestTitle: "Atcoder Grand Contest 58"
    },
];

export const getContests = async (offset: number=0, limit: number=10 ) =>{


    await new Promise(resolve=>setTimeout(resolve, 100));
    
    return {
        offset,
        limit,
        contests: DUMMY_CONTESTS
    };
}