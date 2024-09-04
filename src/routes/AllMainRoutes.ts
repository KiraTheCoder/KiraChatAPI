import express from "express";
import { userRoute } from "@src/routes/userRoutes/userRoute"
import { adminRoutes } from "@src/routes/adminRoutes"


// router
const router = express.Router();

// admin
router.use("/admin", adminRoutes);
///////////////// user /////////////////
router.use("/user", userRoute)

export { router as AllMainRoutes };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// test 

import { singleUserChatModel, userChatReferenceModel } from "@src/models"


router.route("/test/chats")
    .delete(
        async (req, res, next) => {
            try {
                await singleUserChatModel.collection.drop();
                await userChatReferenceModel.collection.drop();
                res.status(200).json({ success: true, message: "Both collections dropped successfully" });
            } catch (error) {
                res.status(404).json({ success: false, message: "Collection not found" });
            }
        });

