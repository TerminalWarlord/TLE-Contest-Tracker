import { Router} from "express";
import { signInController, signUpController } from "../controllers/authController";

const router = Router();


router.post("/signup", signUpController);
router.post("/login", signInController);




export const authRoutes = router;

