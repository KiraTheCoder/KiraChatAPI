import { Router } from "express";
import { singleUserChatController } from "@src/controllers"
import { verifyToken } from "@src/middlewares";

const router = Router()
router.route("/")
    .get(verifyToken, singleUserChatController)

export { router as chatRoute }