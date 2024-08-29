import { Types } from "mongoose";

export interface IUserChatReference {
    userId: any;
    friendsIds: Types.ObjectId[];
    groupIds: Types.ObjectId[];
}