import { Router } from "express";
import {
    createGroupChatController, setGroupImageController, getGroupChatController,
    getGroupChatsController
} from "@src/controllers"
import { upload } from "@src/services/lib/multer"

const router = Router()

router.route("/")
    .get(getGroupChatController)

router.route("/create")
    .post(createGroupChatController)

router.route("/upload_image")
    .post(upload.single("image"), setGroupImageController)

router.route("/details")
    .get(getGroupChatsController)

export { router as groupChatRoute }