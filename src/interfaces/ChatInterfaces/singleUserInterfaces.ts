export interface IsingleUserChat {
    chatId: [string, string],
    messages: { userId: string, message: string }[],
    createdAt: Date,
}