import { Router } from "express";
import {
    getSingleUserChatHistoryRoute, getSingleUserChatController
} from "@src/controllers"

const router = Router()

router.route("/list")
    .get(getSingleUserChatHistoryRoute)

router.route("/data")
    .get(getSingleUserChatController)

export { router as singleChatRoute }