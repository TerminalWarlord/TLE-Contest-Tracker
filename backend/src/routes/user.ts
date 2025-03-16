import { Router } from "express";
import { authWall, getMe } from "../controllers/userController";

const router = Router();

router.get("/me", authWall, getMe);



export const userRoutes = router;