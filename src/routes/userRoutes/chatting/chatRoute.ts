import { Router } from "express";
import {
    deleteChatHistory
} from "@src/controllers"
import { groupChatRoute } from "@src/routes/userRoutes/chatting/groupChatRoute"
import { singleChatRoute } from "@src/routes/userRoutes/chatting/singleChatRoute"

const router = Router()

router.route("/delete_history")
    .delete(deleteChatHistory)

router.use("/single", singleChatRoute)

// group route
router.use("/group", groupChatRoute)

export { router as chatRoute }