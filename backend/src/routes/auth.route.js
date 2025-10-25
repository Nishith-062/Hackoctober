import { Router } from "express";
import { authCallBack } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router=Router()

router.post('/sync',authCallBack)


export default router