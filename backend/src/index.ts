import express from "express";
import { contestRoutes } from "./routes/contests";
import { mapWithYoutubePlaylist } from "./utils/youtube";

const app = express();
app.use(express.json());

app.use(contestRoutes);



app.listen(process.env.PORT || 3000);