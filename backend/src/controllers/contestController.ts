
import { Request, Response } from "express";
import { prismaClient } from "../utils/db";
import { PlatformType } from "../types/contest";
import codeforces from "../utils/codeforces";
import codechef from "../utils/codechef";
import leetcode from "../utils/leetcode";
import { populateDbWithVideos } from "../utils/youtube";

const getContests = async (req: Request, res: Response) => {
    const { offset = 0, limit = 10, platforms, filterType }:
        { offset: number, limit: number, platforms: string[], filterType: string } = req.body;



    // These should be executed with a CRON job periodically
    // for the time being I'm keeping them here

    // await populateDbWithVideos();
    // await codeforces();
    // await leetcode();
    // await codechef();

    // Convert list of string to list of PlatformType
    const typedPlatform = platforms.map(platform => platform as PlatformType);


    const whereClause = {
        platform: {
            in: typedPlatform
        },
        startsAt: {}
    };

    // If filter filterType is set to past we filter out the contests
    // using current time in Unix and taking contests that started less than 
    // that value
    if (filterType === "past") {
        whereClause.startsAt = { lte: Date.now() / 1000 }
    }
    else {
        // Similarly filter the upcoming ones
        whereClause.startsAt = { gt: Date.now() / 1000 }
    }

    try {
        // Filter the results based on selected platforms, offset and limit
        const contests = await prismaClient.contest.findMany({
            skip: offset,
            orderBy: {
                startsAt: "desc"
            },
            take: limit,
            where: whereClause,
        })
        res.json({
            contests,
            message: "Success",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to communicate with the database!"
        })
    }


}


export { getContests };