import { model, Schema, Types } from "mongoose";
import { IgroupChat } from "@src/interfaces";

const groupChatSchema = new Schema<IgroupChat>({
    roomId: { type: Types.ObjectId, default: () => new Types.ObjectId(), required: true },
    userIds: [{ type: Types.ObjectId, ref: 'users', required: true }],
    adminIds: [{ type: Types.ObjectId, ref: 'users', required: true }],
    messages: [
        {
            userId: { type: Types.ObjectId, ref: 'users', required: true },
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

export const groupChatModel = model<IgroupChat>("GroupChat", groupChatSchema);
