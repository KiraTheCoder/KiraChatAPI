import { model, Schema, Types } from "mongoose";
import { IsingleUserChat } from "@src/interfaces";

const singleUserChatSchema = new Schema<IsingleUserChat>({
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
            userId: { type: Types.ObjectId, ref: 'users', required: true },
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

export const singleUserChatModel = model<IsingleUserChat>("singleUserChat", singleUserChatSchema);
