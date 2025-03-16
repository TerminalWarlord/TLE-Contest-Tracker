import { prismaClient } from "./db";
import { getUnixTime } from "./helper";


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

        if(!results.length){
            return;
        }

        // get the exisiting CC contests that are already in the DB
        const existingContest = await prismaClient.contest.findMany({
            where: {
                platform: "CODECHEF"
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
                const url = "https://www.codechef.com/" + res.contest_code;
                return !existingUrls.includes(url);
            })
            .map(async (res: any) => {
                try {
                    // Format the contest data
                    const url = "https://www.codechef.com/" + res.contest_code;

                    // Convert the date string to Unix
                    const startsAt = getUnixTime(res.contest_start_date);

                    // Convert the duration from minutes to seconds
                    const duration = parseInt(res.contest_duration) * 60;


                    // Store the new contests to the DB
                    await prismaClient.contest.create({
                        data: {
                            url,
                            duration: duration,
                            startsAt: startsAt,
                            title: res.contest_name,
                            platform: "CODECHEF"
                        }
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }));
        // NOT THE BEST IDEA BUT Recursively add 500 contests to the DB
        // if (offset <= 500) {
        await codechef(offset + 20);
        // }
    }
    catch (err) {
        console.log(err);
    }
}


export default codechef;