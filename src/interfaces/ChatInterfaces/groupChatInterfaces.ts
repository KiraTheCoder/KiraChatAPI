export interface IgroupChat {
    adminIds: string[];
    userIds: string[];
    messages: { userId: string, message: string, createdAt: Date }[];
    name: string;
    image: { data: string, contentType: string };

}
