import { Router } from "express";
import { getContests } from "../controllers/contestController";


const router = Router();


router.get('/contests', getContests);

export const contestRoutes = router;