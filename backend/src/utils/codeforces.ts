import { prismaClient } from "./db";

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
                    // Store the new contests to the DB
                    await prismaClient.contest.create({
                        data: {
                            duration: res.durationSeconds,
                            startsAt: res.startTimeSeconds,
                            title: res.name,
                            url: "https://codeforces.com/contest/" + res.id,
                            platform: "CODEFORCES"
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