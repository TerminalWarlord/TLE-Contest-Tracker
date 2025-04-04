import { NextFunction, Response } from "express";
import { ContestType, MongooseFilter, PlatformType } from "../types/contest";
import { getUserIdFromHeader } from "../utils/helper";
import { CustomRequest } from "../types/user";
import { Contest } from "../models/contestModel";
import { User } from "../models/userModel";
import { Bookmark } from "../models/bookmark";
import mongoose from "mongoose";




export const getContests = async (req: CustomRequest, res: Response, next: NextFunction) => {

    try {
        const { offset = "0", limit = "10", platforms = "", filterType = "all", isBookmark = false } = req.query;

        // Convert query parameters to correct types
        const parsedOffset = Math.max(parseInt(offset as string, 0), 0);
        const parsedLimit = Math.max(parseInt(limit as string, 10), 20);



        // Convert list of string to list of PlatformType
        const typedPlatform = platforms ? (platforms as string).split(',').map(platform => platform as PlatformType) : [];



        const filters: MongooseFilter = {
            platform: { $in: typedPlatform },
            startsAt: { $exists: true }
        };

        // If the request is for user bookmarks, set the userId first using token in the headers
        // get the user from DB and set in on req 
        if (isBookmark) {
            if (!getUserIdFromHeader(req, res)) {
                return;
            }
        }

        // If filter filterType is set to past we filter out the contests
        // using current time in Unix and taking contests that started less than 
        // that value
        if (filterType === "past") {
            filters.startsAt = { $lt: Math.floor(Date.now() / 1000) }
        }
        else if (filterType === "upcoming") {
            // Similarly filter the upcoming ones
            filters.startsAt = { $gt: Math.floor(Date.now() / 1000) }
        }
        // console.log(whereClause)





        try {
            // Filter the results based on selected platforms, offset and limit
            // Taking limit+1 items to determine if there would be more items left after 
            // taking limit items, and use it to return hasNextPage


            let transformedContests: any[] = [];

            if (req.userId) {
                const contests = await Bookmark.find({
                    userId: new mongoose.Types.ObjectId(req.userId)
                })
                    .populate({
                        path: "contestId",
                        match: filters
                    })
                    .skip(parsedOffset)
                    .limit(parsedLimit + 1)
                    .lean();

                // Extract only the contest objects
                const contestList = contests
                    .map(bookmark => bookmark.contestId)
                    .filter(contest => contest !== null && contest !== undefined);



                // Mark the contest true if they are bookmarked, also remove the "bookmark" data
                transformedContests = (contestList as unknown as ContestType[])
                    .map(contest => {

                        // Current unix time
                        const currentTime = Date.now() / 1000;
                        const endsAt = contest.startsAt + contest.duration;
                        const updatedHasEnded = currentTime > endsAt;

                        // Yonked this idea from codeforces, best way to sort contests
                        // sort them based on the time difference from now in ascending order
                        const relativeTime = currentTime - contest.startsAt;

                        // Check if its currently running
                        const isRunning = currentTime >= contest.startsAt && currentTime <= endsAt;
                        return {
                            ...contest,
                            relativeTime,
                            isRunning,
                            hasEnded: updatedHasEnded,
                            isBookmarked: true
                        }
                    }).sort((a, b) => {
                        if (filterType === "upcoming") {
                            return b.relativeTime - a.relativeTime;
                        } else {
                            return a.relativeTime - b.relativeTime;
                        }
                    });


            }
            else {
                const contests = await Contest.find({ ...filters })
                    .sort({
                        startsAt: (filterType === "all"
                            || filterType === "past") ? "desc" : 'asc'
                    })
                    .skip(parsedOffset)
                    .limit(parsedLimit+1)
                    .lean();

                // Mark the contest true if they are bookmarked, also remove the "bookmark" data
                transformedContests = contests.map((contest) => {

                    // Current unix time
                    const currentTime = Date.now() / 1000;
                    const endsAt = contest.startsAt + contest.duration;
                    const updatedHasEnded = currentTime > endsAt;

                    // Check if its currently running
                    const isRunning = currentTime >= contest.startsAt && currentTime <= endsAt;

                    // Yonked this idea from codeforces, best way to sort contests
                    // sort them based on the time difference from now in ascending order
                    const relativeTime = currentTime - contest.startsAt;
                    return {
                        ...contest,
                        isRunning,
                        relativeTime,
                        hasEnded: updatedHasEnded,
                        isBookmarked: false
                    }
                }).sort((a, b) => {
                    if (filterType === "upcoming") {
                        return b.relativeTime - a.relativeTime;
                    } else {
                        return a.relativeTime - b.relativeTime;
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
    const user = await User.findById(req.userId);
    if (!user || user.role !== "ADMIN") {
        res.status(403).json({
            message: "You don't have permission to edit contest!"
        });
        return;
    }
    try {
        await Contest.updateOne(
            { _id: contestId },
            { $set: { youtubeUrl } }
        );
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