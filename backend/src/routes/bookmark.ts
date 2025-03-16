import { Router } from "express";
import { getContests } from "../controllers/contestController";
import { authWall, bookmarkController } from "../controllers/userController";


const router = Router();


router.get('/bookmark', authWall, bookmarkController);

export const bookmarkRoutes = router;