import { Contest } from "../models/contestModel";
import { Video } from "../models/videoModel";
import { mapWithYoutubePlaylist } from "./youtube";

const codeforces = async () => {
    try {
        // Get the list of all CF contests
        const res = await fetch('https://codeforces.com/api/contest.list?gym=false');

        // bad status code, raise error
        if (!res.ok) {
            throw Error("Failed to get Codeforces contests");
        }

        // get the result 
        const results = (await res.json()).result;


        // get the exisiting CF contests that are already in the DB
        const existingContests = await Contest.find({
            platform: "CODEFORCES",
        }).select("url startsAt youtubeUrl");

        // current time in unix seconds
        const curTime = Date.now() / 1000;

        // create a list of string from list of obj
        const existingUrls = existingContests
            .filter(contest => {
                return contest.youtubeUrl !== undefined && contest.youtubeUrl.length;
            }) //filter out contests which has no yt urls
            .filter(contest => contest.startsAt < curTime) //This is to handle in case the contest time chnages
            .map(contest => contest.url);



        // Populate the DB
        const filteredResult = results.filter((res: any) => {
            // filter out the exisiting contests
            const url = "https://codeforces.com/contest/" + res.id;
            return !existingUrls.includes(url);
        });

        for (const res of filteredResult) {
            try {
                // Basic contest data
                const title = res.name;
                const startsAt = res.startTimeSeconds;
                const duration = res.durationSeconds;
                const url = "https://codeforces.com/contest/" + res.id;
                // console.log(title)

                // Check if the contest has ended
                // const currentTimeInUnix = Math.floor((Date.now() / 1000))
                // const hasEnded = startsAt < currentTimeInUnix;

                // Get the appropiate yt url
                // console.log("Searching for match", title)
                const youtubeUrl = await mapWithYoutubePlaylist("CODEFORCES", title, url);
                // console.log("error", "done")
                try {
                    // Store the new contests to the DB
                    await Contest.updateOne({
                        url,
                        platform: "CODEFORCES",

                    }, {
                        $set: {
                            title,
                            duration,
                            startsAt,
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
        }
        console.log("Total results fetched:", results.length);
        console.log("Filtered results:", results.filter((res: any) => !existingUrls.includes("https://codeforces.com/contest/" + res.id)).length);
    }
    catch (err) {
        console.log(err)
    }
}

export default codeforces;