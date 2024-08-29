import { Router } from "express";
import { singleUserChatGetController, groupChatGetController, deleteChatHistory } from "@src/controllers"
import { verifyToken } from "@src/middlewares";

const router = Router()
router.route("/single")
    .get(verifyToken, singleUserChatGetController)

router.route("/group")
    .get(verifyToken, groupChatGetController)

router.route("/delete_history")
    .delete(verifyToken, deleteChatHistory)



export { router as chatRoute }