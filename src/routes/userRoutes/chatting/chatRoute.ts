import { Router } from "express";
import {
    getSingleUserChatController,
    deleteChatHistory
} from "@src/controllers"
import { groupChatRoute } from "@src/routes/userRoutes/chatting/groupChatRoute"

const router = Router()

router.route("/delete_history")
    .delete(deleteChatHistory)

router.route("/single")
    .get(getSingleUserChatController)

// group route
router.use("/group", groupChatRoute)

export { router as chatRoute }