import { Contest } from "../models/contestModel";
import { getUnixTime } from "./helper";
import { mapWithYoutubePlaylist } from "./youtube";


const codechef = async (offset: number = 0) => {
    console.log("fetching codechef, offset", offset)
    try {
        // Get the list of all CC contests
        const res = await fetch(`https://www.codechef.com/api/list/contests/past?sort_by=START&sorting_order=desc&offset=${offset}&mode=all`);


        // bad status code, raise error
        if (!res.ok) {
            throw Error("Failed to get Codechef contests");
        }

        // get the result 
        const results = (await res.json()).contests;


        // Get the upcoming contests
        if (offset === 0) {
            const upcomingContests = await getCodechefUpcomingContests();
            results.push(...upcomingContests);
        }




        if (!results.length) {
            return;
        }

        // get the exisiting CC contests that are already in the DB
        const existingContests = await Contest.find({
            platform: "CODECHEF",
        }).select("url youtubeUrl startsAt");

        // current time in unix seconds
        const curTime = Date.now() / 1000;

        // create a list of string from list of obj
        const existingUrls = existingContests
            .filter(contest => {
                return contest.youtubeUrl !== undefined && contest.youtubeUrl.length;
            })
            .filter(contest => contest.startsAt < curTime) //This is to handle in case the contest time chnages
            .map(contest => contest.url);


        // Populate the DB
        const filteredResult = results
            .filter((res: any) => {
                // filter out the exisiting contests
                const url = "https://www.codechef.com/" + res.contest_code;
                return !existingUrls.includes(url);
            })


        if (!filteredResult.length) {
            return;
        }

        
        for (const res of filteredResult) {
            try {
                const title = res.contest_name;
                // Format the contest data
                const url = "https://www.codechef.com/" + res.contest_code;

                // Convert the date string to Unix
                const startsAt = getUnixTime(res.contest_start_date);

                // Convert the duration from minutes to seconds
                const duration = parseInt(res.contest_duration) * 60;

                // Check if the contest has ended
                // const currentTimeInUnix = Math.floor((Date.now() / 1000))
                // const hasEnded = startsAt < currentTimeInUnix;

                // Get the appropiate yt url
                // spliting the title at "(" because the pattern of CC is
                // Starters 1xx (Rated till X stars)
                const youtubeUrl = await mapWithYoutubePlaylist("CODECHEF", title.split('(')[0], url);

                try {
                    // Store the new contests to the DB
                    await Contest.updateOne({
                        url,
                        platform: "CODECHEF",
                    }, {
                        $set: {
                            title,
                            duration: duration,
                            startsAt: startsAt,
                            youtubeUrl: youtubeUrl?.fullUrl
                        }
                    }, { upsert: true });
                }
                catch (err) {
                    console.log(url, "has already been added");
                }
            }
            catch (err) {
                console.log(err);
            }
        };
        // NOT THE BEST IDEA BUT Recursively add 500 contests to the DB
        // if (offset <= 500) {
        await codechef(offset + 20);
        // }
    }
    catch (err) {
        console.log(err);
    }
}

const getCodechefUpcomingContests = async () => {
    try {
        const res = await fetch('https://www.codechef.com/api/list/contests/all');

        // bad status code, raise error
        if (!res.ok) {
            throw Error("Failed to get Codechef contests");
        }
        const resData = await res.json();
        return resData.future_contests;
    }
    catch (err) {
        return [];
    }
}



export default codechef;