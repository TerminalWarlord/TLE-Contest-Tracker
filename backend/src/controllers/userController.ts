import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { prismaClient } from "../utils/db";
import { PlatformType } from "../types/contest";


interface CustomRequest extends Request {
    userId?: number
}

const authWall = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization as string;

    // If no authorization header is set, return
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(403).json({
            message: "Unauthorized"
        });
        return;
    }

    // Split and take the portion after "Bearer "
    const token = authHeader.split(" ")[1];


    // Now verify the token's validity
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: number };
        req.userId = decodedToken.userId;
    }
    catch (err) {
        // JWT throws error if the token is invalid
        res.status(403).json({
            message: "Invalid token!"
        });
        return;
    }
    next();
}



const bookmarkController = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const { contestId }: { contestId: number } = req.body;
    const user = await prismaClient.user.findFirst({
        where: {
            id: userId
        }
    });

    if (!user || !userId) {
        res.status(403).json({
            message: "Invalid request!"
        });
        return;
    }
    const bookmark = await prismaClient.bookmark.findFirst({
        where: {
            contestId: contestId,
            userId: userId
        }
    })
    if (bookmark) {
        const newBookmark = await prismaClient.bookmark.create({
            data: {
                contestId: contestId,
                userId: userId
            }
        });
        res.json({
            message: "Successfully added contest to the bookmark!",
            bookmark: newBookmark
        })
        return;
    }


    res.json({
        message: "Successfully removed bookmark!",
    })

}

const getBookmarks = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const { offset = 0, limit = 10, platforms, filterType }:
        { offset: number, limit: number, platforms: string[], filterType: string } = req.body;


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
        const bookmarks = await prismaClient.bookmark.findMany({
            where: {
                userId: userId,
                contest: whereClause
            }
        });
        res.json({
            message: "successful",
            bookmarks
        })
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }

}


const getMe = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;

    try {
        const user = await prismaClient.user.findFirst({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        res.json({
            ...user
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to communicate with the database!"
        })
    }
}


export {
    authWall,
    bookmarkController,
    getBookmarks,
    getMe,
}