import { Schema, model } from 'mongoose';
import { IUser } from "@src/interfaces"

const userSchema = new Schema<IUser>({
    name: { type: "string", required: true },
    phoneNumber: { type: "string", required: true, unique: true },
    image: { data: String, contentType: String }
})

export const UserModel = model<IUser>("user", userSchema, "users")