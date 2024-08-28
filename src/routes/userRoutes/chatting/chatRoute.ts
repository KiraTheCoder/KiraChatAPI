import { Router } from "express";
import { singleUserChatGetController, groupChatGetController } from "@src/controllers"
import { verifyToken } from "@src/middlewares";

const router = Router()
router.route("/single")
    .get(verifyToken, singleUserChatGetController)
    
router.route("/group")
    .get(verifyToken, groupChatGetController)


export { router as chatRoute }