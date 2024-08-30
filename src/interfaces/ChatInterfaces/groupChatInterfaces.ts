export interface IgroupChat {
    roomId: any;
    adminIds: string[];
    userIds: string[];
    messages: { userId: string, message: string, createdAt: Date }[];
    name: string;
    image: { data: string, contentType: string };

}
