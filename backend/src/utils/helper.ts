import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { CustomRequest } from "../types/user";



export const getUnixTime = (datetime: string): number => {
    const formattedUnixTime = Math.floor(new Date(datetime).getTime() / 1000);
    return formattedUnixTime;
}


export const getUserIdFromHeader = (req: CustomRequest, res: Response) => {
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
        const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decodedToken.userId;
        return true
    }
    catch (err) {
        // JWT throws error if the token is invalid
        res.status(403).json({
            message: "Invalid token!"
        });
        return false;
    }
}

