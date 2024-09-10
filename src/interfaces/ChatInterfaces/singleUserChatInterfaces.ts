export interface IsingleUserChat {
    _id:boolean
    chatId: [any],
    messages: { userId: string, message: string, createdAt: string }[],
}