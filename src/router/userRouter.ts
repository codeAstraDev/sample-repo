import { Router } from "express";
import { userController } from "../controllers/userControllers";

const router = Router()

router.get("/getall",userController.getAllUsers)
router.post("/signup",userController.signup)
router.post("/signin",userController.signin)

export const userRouter = router;