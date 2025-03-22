import { Contest } from "../models/contestModel";
import { mapWithYoutubePlaylist } from "./youtube";



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
        if(page===1){
            const upcomingContests = await twoTopContests();
            results.push(...upcomingContests);
        }

        // get the exisiting LC contests that are already in the DB
        const existingContests = await Contest.find({
            platform: "LEETCODE",
            youtubeUrl: { $exists: true, $ne: "" }
        }).select("url");
        
        // create a list of string from list of obj
        const existingUrls = existingContests.map(contest => contest.url);


        // Populate the DB
        const filteredResult = results
            .filter((res: any) => {
                // filter out the exisiting contests
                const url = "https://leetcode.com/contest/" + res.titleSlug;
                return !existingUrls.includes(url);
            });
        for(const res of filteredResult){
                try {
                    // Format the contest data
                    const url = "https://leetcode.com/contest/" + res.titleSlug;
                    const title = res.title;
                    const duration = res.duration;
                    const startsAt = res.startTime;

                    // Check if the contest has ended
                    // const currentTimeInUnix = Math.floor((Date.now() / 1000))
                    // const hasEnded = startsAt < currentTimeInUnix;

                    // Get the appropiate yt url
                    const youtubeUrl = await mapWithYoutubePlaylist("LEETCODE", title, url);

                    try{
                        // Store the new contests to the DB
                        await Contest.create({
                            url,
                            duration,
                            startsAt,
                            title,
                            platform: "LEETCODE",
                            youtubeUrl: youtubeUrl?.fullUrl
                        });
                    }
                    catch (err) {
                        console.log(url, "has already been added");
                    }
                    
                    
                }
                catch (err) {
                    console.log(res);
                    console.log(err);
                }
            };

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