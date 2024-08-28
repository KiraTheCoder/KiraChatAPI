export interface IsingleUserChat {
    chatId: [any],
    messages: { userId: string, message: string, createdAt: Date }[],
}