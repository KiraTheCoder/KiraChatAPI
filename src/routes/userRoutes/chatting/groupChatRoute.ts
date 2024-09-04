import { Router } from "express";
import {
    createGroupChatController, setGroupImageController, getGroupChatController,
    getGroupChatsController,getGroupChatHistoryController,deleteGroupChatController,
    addMemberInGroupController, removeMemberInGroupController
} from "@src/controllers"
import { upload } from "@src/services/lib/multer"

const router = Router()

router.route("/")
.post(createGroupChatController)
    .get(getGroupChatController)
    .delete(deleteGroupChatController)

router.route("/upload_image")
    .post(upload.single("image"), setGroupImageController)

router.route("/details")
    .get(getGroupChatsController)

router.route("/list")
    .get(getGroupChatHistoryController)

router.route("/member")
    .patch(addMemberInGroupController)
    .delete(removeMemberInGroupController)

export { router as groupChatRoute }