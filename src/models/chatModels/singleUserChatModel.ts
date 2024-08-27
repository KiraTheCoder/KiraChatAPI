import { model, Schema } from "mongoose";
import { IsingleUserChat } from "@src/interfaces";

const singleUserChatSchema = new Schema<IsingleUserChat>({
    chatId: {
        type: [String],
        required: true,
        validate: {
            validator: (v: string[]) => v.length === 2,
            message: "chatId must be an array of exactly 2 strings."
        }
    },
    messages: [
        {
            userId: { type: String, required: true },
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

export const singleUserChatModel = model<IsingleUserChat>("singleUserChat", singleUserChatSchema);
