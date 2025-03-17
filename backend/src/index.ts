import express from "express";
import { contestRoutes } from "./routes/contests";
import { authRoutes } from "./routes/auth";
import { bookmarkRoutes } from "./routes/bookmark";
import { userRoutes } from "./routes/user";
import cors from "cors";



const app = express();
app.use(express.json());

// TODO: Update cors whitelist
app.use(cors())

app.use("/v1", contestRoutes);
app.use("/v1", authRoutes);
app.use("/v1", userRoutes);
app.use("/v1", bookmarkRoutes);


app.listen(process.env.PORT || 3000);