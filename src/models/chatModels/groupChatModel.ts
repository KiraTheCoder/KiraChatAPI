import { model, Schema, Types } from "mongoose";
import { IgroupChat } from "@src/interfaces";

const groupChatSchema = new Schema<IgroupChat>({
    userIds: [{ type: Types.ObjectId, ref: 'users' }],
    adminIds: [{ type: Types.ObjectId, ref: 'users' }],
    messages: [
        {
            userId: { type: Types.ObjectId, ref: 'users', required: true },
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    name: { type: String, required: true },
    image: { data: String, contentType: String }
});



export const groupChatModel = model<IgroupChat>("GroupChat", groupChatSchema);
