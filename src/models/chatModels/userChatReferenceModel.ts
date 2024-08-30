import { Schema, Types, model } from "mongoose";
import { IUserChatReference } from "@src/interfaces"

const userChatReferenceSchema = new Schema<IUserChatReference>({
    userId: { type: Types.ObjectId, ref: 'users', required: true, unique: true },
    friendsIds: [{ type: Types.ObjectId, ref: 'users', required: true }],
    groupIds: [{ type: Types.ObjectId, ref: 'GroupChat', required: true}]
});
const userChatReferenceModel = model<IUserChatReference>("UserChatReference", userChatReferenceSchema)

export { userChatReferenceModel }