import express from "express";
import { contestRoutes } from "./routes/contests";

const app = express();
app.use(express.json());

app.use(contestRoutes);



app.listen(process.env.PORT || 3000);