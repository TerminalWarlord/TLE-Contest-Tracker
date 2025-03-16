import { prismaClient } from "./db";
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
        const existingContest = await prismaClient.contest.findMany({
            where: {
                platform: "CODEFORCES"
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
                const url = "https://codeforces.com/contest/" + res.id;
                return !existingUrls.includes(url);
            })
            .map(async (res: any) => {
                try {

                    
                    // Basic contest data
                    const title = res.name;
                    const startsAt = res.startTimeSeconds;
                    const duration = res.durationSeconds;
                    const url = "https://codeforces.com/contest/" + res.id;
                    
                    // Check if the contest has ended
                    const currentTimeInUnix = Math.floor((Date.now() / 1000))
                    const hasEnded = startsAt < currentTimeInUnix;

                    // Get the appropiate yt url
                    const youtubeUrl = await mapWithYoutubePlaylist("CODEFORCES", title, url);


                    // Store the new contests to the DB
                    await prismaClient.contest.create({
                        data: {
                            hasEnded,
                            duration,
                            startsAt,
                            title,
                            url,
                            platform: "CODEFORCES",
                            youtubeUrl: youtubeUrl?.id
                        }
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }));
    }
    catch (err) {
        console.log(err)
    }
}

export default codeforces;