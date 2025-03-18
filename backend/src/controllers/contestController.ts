
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../utils/db";
import { PlatformType } from "../types/contest";
import codeforces from "../utils/codeforces";
import codechef from "../utils/codechef";
import leetcode from "../utils/leetcode";
import { populateDbWithVideos } from "../utils/youtube";
import { getUserIdFromHeader } from "../utils/helper";
import { CustomRequest } from "../types/user";

export const getContests = async (req: CustomRequest, res: Response, next: NextFunction) => {

    try {

        const { offset = "0", limit = "10", platforms = "", filterType = "all", isBookmark = false } = req.query;

        // Convert query parameters to correct types
        const parsedOffset = Math.max(parseInt(offset as string, 0), 0);
        const parsedLimit = Math.max(parseInt(limit as string, 10), 20);

        // These should be executed with a CRON job periodically
        // for the time being I'm keeping them here

        // await populateDbWithVideos();
        // await codeforces();
        // await leetcode();
        // await codechef();

        // Convert list of string to list of PlatformType
        const typedPlatform = platforms ? (platforms as string).split(',').map(platform => platform as PlatformType) : [];



        const whereClause = {
            platform: {
                in: typedPlatform
            },
            startsAt: {},
            bookmark: {}
        };

        // If the request is for user bookmarks, set the userId first using token in the headers
        // get the user from DB and set in on req 
        if (isBookmark) {
            getUserIdFromHeader(req, res);
            if (req.userId) {
                whereClause.bookmark = {
                    some: {
                        userId: req.userId
                    }
                }
            }
        }

        // If filter filterType is set to past we filter out the contests
        // using current time in Unix and taking contests that started less than 
        // that value
        if (filterType === "past") {
            whereClause.startsAt = { lte: Date.now() / 1000 }
        }
        else if (filterType === "upcoming") {
            // Similarly filter the upcoming ones
            whereClause.startsAt = { gt: Date.now() / 1000 }
        }
        // console.log(whereClause)





        try {
            // Filter the results based on selected platforms, offset and limit
            // Taking limit+1 items to determine if there would be more items left after 
            // taking limit items, and use it to return hasNextPage


            let transformedContests: any[] = [];

            // Intentionally making it redundant
            // Will clean it up later
            if (req.userId) {
                const contests = await prismaClient.contest.findMany({
                    skip: parsedOffset,
                    orderBy: {
                        startsAt: (filterType === "past" || filterType === "all") ? "desc" : "asc",
                    },
                    take: parsedLimit + 1,
                    where: whereClause,
                    include: {
                        bookmark: {
                            where: {
                                userId: req.userId
                            },
                            select: { id: true },
                        }
                    }

                })

                // Mark the contest true if they are bookmarked, also remove the "bookmark" data
                transformedContests = contests.map((contest) => {
                    // TODO: Remove hasEnded logic from platforms
                    const { bookmark, hasEnded, ...contestWithoutBookmark } = contest;



                    // Current unix time
                    const currentTime = Date.now() / 1000;
                    const endsAt = contest.startsAt + contest.duration;
                    const updatedHasEnded = currentTime > endsAt;

                    // Check if its currently running
                    const isRunning = currentTime >= contest.startsAt && currentTime <= endsAt;
                    return {
                        ...contestWithoutBookmark,
                        isRunning,
                        hasEnded: updatedHasEnded,
                        isBookmarked: bookmark.length > 0
                    }
                });
            }
            else {
                const contests = await prismaClient.contest.findMany({
                    skip: parsedOffset,
                    orderBy: {
                        startsAt: (filterType === "past" || filterType === "all") ? "desc" : "asc",
                    },
                    take: parsedLimit + 1,
                    where: whereClause,
                })

                // Mark the contest true if they are bookmarked, also remove the "bookmark" data
                transformedContests = contests.map((contest) => {
                    const { hasEnded, ...contestWithoutBookmark } = contest;



                    // Current unix time
                    const currentTime = Date.now() / 1000;
                    const endsAt = contest.startsAt + contest.duration;
                    const updatedHasEnded = currentTime > endsAt;

                    // Check if its currently running
                    const isRunning = currentTime >= contest.startsAt && currentTime <= endsAt;
                    return {
                        ...contestWithoutBookmark,
                        isRunning,
                        hasEnded: updatedHasEnded,
                        isBookmarked: false
                    }
                });
            }



            let hasNextPage = false;
            if (transformedContests.length > parsedLimit) {
                transformedContests.pop();
                hasNextPage = true;
            }

            res.json({
                hasNextPage,
                contests: transformedContests,
                message: "Success",
            });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({
                message: "Failed to communicate with the database!"
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Something went wrong!"
        })
    }


}

export const editContestYoutubeUrl = async (req: CustomRequest, res: Response) => {
    const { contestId, youtubeUrl } = req.body;
    const user = await prismaClient.user.findFirst({ where: { id: req.userId } });
    if (!user || user.role !== "ADMIN") {
        res.status(403).json({
            message: "You don't have permission to edit contest!"
        });
        return;
    }
    try {
        await prismaClient.contest.update({
            where: { id: contestId },
            data: {
                youtubeUrl
            }
        });
        res.json({
            message: "Successfully updated contest!"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to update contest"
        });
    }
}