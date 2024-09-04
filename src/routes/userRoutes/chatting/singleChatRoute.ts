import { Router } from "express";
import {
    getSingleUserChatHistoryController, getSingleUserChatController
} from "@src/controllers"

const router = Router()

router.route("/list")
    .get(getSingleUserChatHistoryController)

router.route("/data")
    .get(getSingleUserChatController)

export { router as singleChatRoute }