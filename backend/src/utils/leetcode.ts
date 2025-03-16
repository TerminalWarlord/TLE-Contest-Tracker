import { prismaClient } from "./db";



const twoTopContests = async () => {
    try {
        const res = await fetch("https://leetcode.com/graphql/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referrer": "https://leetcode.com"
            },
            body: JSON.stringify({
                "query": "query topTwoContests { topTwoContests { title titleSlug startTime duration } }",
                "operationName": "topTwoContests"
            })
        });
        if (!res.ok) {
            return [];
        }
        const resData = (await res.json()).data.topTwoContests;
        return resData;
    }
    catch (err) {
        return []
    }
}

const leetcode = async (page: number = 1) => {
    console.log("fetching LEETCODE, Page ", page)
    try {
        // Get the list of all LC contests
        // It uses graphQL
        const res = await fetch("https://leetcode.com/graphql/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referrer": "https://leetcode.com"
            },
            body: JSON.stringify({
                "query": "query pastContests($pageNo: Int, $numPerPage: Int) { pastContests(pageNo: $pageNo, numPerPage: $numPerPage) { pageNum currentPage totalNum numPerPage data { title titleSlug startTime duration } } }",
                "variables": {
                    "pageNo": page
                },
                "operationName": "pastContests"
            })
        });

        // Read the response
        const resData = await res.json();




        // bad status code, raise error
        if (!res.ok) {
            console.log(resData)
            throw Error("Failed to get Leetcode contests");
        }

        // Calculate total number of pages to go through
        const totalPages = Math.ceil((resData.data.pastContests.totalNum) / 10);


        // get the result 
        const results = resData.data.pastContests.data;

        // results array dont contain upcoming contests, so we have fetch
        // them separately and merge them with results
        const upcomingContests = await twoTopContests();
        results.push(...upcomingContests);

        // get the exisiting CC contests that are already in the DB
        const existingContest = await prismaClient.contest.findMany({
            where: {
                platform: "LEETCODE"
            },
            select: {
                url: true
            }
        });


        // create a list of string from list of obj
        const existingUrls = existingContest.map(contest => contest.url);


        // Populate the DB
        await Promise.all(results
            .filter((res: any) => {
                // filter out the exisiting contests
                const url = "https://leetcode.com/contest/" + res.titleSlug;
                return !existingUrls.includes(url);
            })
            .map(async (res: any) => {
                try {
                    // Format the contest data
                    const url = "https://leetcode.com/contest/" + res.titleSlug;

                    // Store the new contests to the DB
                    await prismaClient.contest.create({
                        data: {
                            url,
                            duration: res.duration,
                            startsAt: res.startTime,
                            title: res.title,
                            platform: "LEETCODE"
                        }
                    });
                }
                catch (err) {
                    console.log(res);
                    console.log(err);
                }
            }));

        // NOT THE BEST IDEA BUT Recursively add contests from 100 pages to the DB
        if (page <= totalPages) {
            await leetcode(page + 1);
        }
    }
    catch (err) {
        console.log(err);
    }
}





export default leetcode;