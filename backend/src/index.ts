import express from "express";
import { contestRoutes } from "./routes/contests";
import { authRoutes } from "./routes/auth";
import { bookmarkRoutes } from "./routes/bookmark";
import { userRoutes } from "./routes/user";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
})




const app = express();
app.use(express.json());

// TODO: Update cors whitelist
app.use(cors());


// Use the rate limiter
app.use(limiter);



app.use("/v1", contestRoutes);
app.use("/v1", authRoutes);
app.use("/v1", userRoutes);
app.use("/v1", bookmarkRoutes);


app.listen(process.env.PORT || 3000);