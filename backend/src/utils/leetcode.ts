import { prismaClient } from "./db";
import { getUnixTime } from "./helper";


const leetcode = async () => {
    console.log("fetching LEETCODE")
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
                    "pageNo": 1
                },
                "operationName": "pastContests"
            })
        });

        console.log(await res.json())
        // bad status code, raise error
        if (!res.ok) {
            console.log(await res.json())
            throw Error("Failed to get Leetcode contests");
        }

        // get the result 
        const results = (await res.json()).data.pastContests.data;

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
                const url = "https://leetcode.com/contest/" + res.contest_code;
                return !existingUrls.includes(url);
            })
            .map(async (res: any) => {
                console.log(res)
                try {
                    // Format the contest data
                    const url = "https://leetcode.com/contest/" + res.contest_code;

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
    }
    catch (err) {
        console.log(err);
    }
}


export default leetcode;