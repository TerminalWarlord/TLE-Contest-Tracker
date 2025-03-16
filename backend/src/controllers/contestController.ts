
import { Request, Response } from "express";
import codeforces from "../utils/codeforces";
import { prismaClient } from "../utils/db";
import { PlatformType } from "../types/contest";
import codechef from "../utils/codechef";
import leetcode from "../utils/leetcode";

const getContests = async (req: Request, res: Response) => {
    const { offset = 0, limit = 10, platforms, type }:
        { offset: number, limit: number, platforms: string[], type: string } = req.body;


    await codeforces();
    await leetcode();
    await codechef();

    // Convert list of string to list of PlatformType
    const typedPlatform = platforms.map(platform => platform as PlatformType);

    const contests = await prismaClient.contest.findMany({
        skip: offset,
        orderBy: {
            startsAt: "desc"
        },
        take: limit,
        where: {
            platform: {
                in: typedPlatform
            },
        },
    })
    res.json({
        contests,
        message: "Success",
    });


}


export { getContests };