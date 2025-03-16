import { Request, Response } from "express";
import { z } from "zod";
import { prismaClient } from "../utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";




const signUpController = async (req: Request, res: Response) => {
    // Intentionally making "name" mandatory here
    const userSchema = z.object({
        email: z.string().email("Must be a valid email!"),
        password: z.string().min(8, "The password should have atleast 8 characters!"),
        name: z.string()
    });

    // Check if the body is malformed
    const parsedUser = userSchema.safeParse(req.body);


    if (parsedUser.success) {
        try {

            // Check if the user already exists with the same email
            const user = await prismaClient.user.findFirst({
                where: { email: parsedUser.data.email }
            });

            // If user exist, show error and return
            if (user) {
                res.status(403).json({
                    message: "User already exists with same email!"
                })
                return;
            }


            // Hash the password
            const hashedPassword = await bcrypt.hash(parsedUser.data.password, 5);


            // Store user data in the DB
            await prismaClient.user.create({
                data: {
                    email: parsedUser.data.email,
                    name: parsedUser.data.name,
                    password: hashedPassword
                }
            });

            res.json({
                message: "You have successfully signed up"
            });
        }
        catch (err) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    }
    else {
        // Malformed request
        res.status(400).json({
            message: parsedUser.error.format()
        })
    }
}


const signInController = async (req: Request, res: Response) => {

    // Create Validation Schema
    const userSchema = z.object({
        email: z.string().email("Invalid Email"),
        password: z.string().min(8, "Invalid Password")
    });

    // Validate body
    const parsedUser = userSchema.safeParse(req.body);

    if (parsedUser.success) {

        try {
            // check if the user actually exists
            const user = await prismaClient.user.findFirst({
                where: { email: parsedUser.data.email }
            });

            // User doesnt exist in our DB
            if (!user) {
                res.status(403).json({
                    message: "User doesn't exist!"
                });
                return;
            }

            // compare the hashed password
            const doesPasswordMatch = bcrypt.compare(parsedUser.data.password, user.password);

            if (!doesPasswordMatch) {
                res.status(403).json({
                    message: "Invalid password"
                });
                return;
            }

            // Generate JWT token and use userId as payload
            const token = jwt.sign({
                userId: user.id
            }, JWT_SECRET);


            // return the JWT token
            res.json({
                token,
                message: "Successfully logged in.",
            });
        }
        catch (err) {
            res.status(500).json({
                message: "Something went wrong!"
            });
        }
    }
    else {
        // Malformed request
        res.status(400).json({
            message: parsedUser.error.format()
        })
    }
}


export {
    signUpController,
    signInController
}