import { model, Schema, Types } from "mongoose";
import { IsingleUserChat } from "@src/interfaces";

const singleUserChatSchema = new Schema<IsingleUserChat>({
    _id:false,
    chatId: {
        type: [{ type: Types.ObjectId, ref: 'users', required: true }],
        required: true,
        validate: {
            validator: (v: Types.ObjectId[]) => Array.isArray(v) && v.length === 2,
            message: "chatId must be an array of exactly 2 user IDs."
        }
    },
    messages: [
        {
            _id: false,
            userId: { type: Types.ObjectId, ref: 'users', required: true },
            message: { type: String, required: true },
            createdAt: { type: String }
        }
    ]
});

export const singleUserChatModel = model<IsingleUserChat>("singleUserChat", singleUserChatSchema);
