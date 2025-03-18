import { Router } from "express";
import { editContestYoutubeUrl, getContests } from "../controllers/contestController";
import { authWall } from "../controllers/userController";


const router = Router();


router.get('/contests', getContests);
router.post('/contest/edit', authWall, editContestYoutubeUrl);

export const contestRoutes = router;