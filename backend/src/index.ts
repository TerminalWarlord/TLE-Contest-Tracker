import express from "express";
import { contestRoutes } from "./routes/contests";
import { authRoutes } from "./routes/auth";
import { bookmarkRoutes } from "./routes/bookmark";
import { userRoutes } from "./routes/user";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { connectDb } from "./utils/db";
require('dotenv').config();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
})


connectDb();

const app = express();
app.use(express.json());

// app.use(cors());

const allowedOrigins = [
    "http://localhost:5173", 
    "https://contest-tracker.joybiswas.com" // Production
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // Allows cookies and authorization headers
}));
// Use the rate limiter
app.use(limiter);



app.use("/v1", contestRoutes);
app.use("/v1", authRoutes);
app.use("/v1", userRoutes);
app.use("/v1", bookmarkRoutes);






app.listen(process.env.PORT || 3000);