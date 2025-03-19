import { NextFunction, Response } from "express";
import { PlatformType } from "../types/contest";
import { getUserIdFromHeader } from "../utils/helper";
import { CustomRequest } from "../types/user";
import { User } from "../models/userModel";
import { Bookmark } from "../models/bookmark";




const authWall = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (getUserIdFromHeader(req, res)) {
        next();
    }
}



const bookmarkController = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const { contestId } = req.body;
    const user = await User.findById(userId);

    if (!user || !userId) {
        res.status(403).json({
            message: "Invalid request!"
        });
        return;
    }
    try {
        const bookmark = await Bookmark.findOne({
            contestId,
            userId
        })
        if (!bookmark) {
            const newBookmark = await Bookmark.create({
                contestId,
                userId
            });
            res.json({
                message: "Successfully added contest to the bookmark!",
                bookmark: newBookmark
            })
            return;
        }
        else {
            await Bookmark.deleteOne({
                contestId,
                userId
            });
            res.json({
                message: "Successfully removed bookmark!",
            })
        }

    }
    catch (err) {
        res.status(500).json({
            message: "Failed to make a database query!"
        })
    }


}



const getMe = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select('_id email name role').lean();

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
    getMe,
}