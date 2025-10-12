import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: [],

  setChats: (chats) => set({ chats }),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
  setMessages: (messages) => set({ messages }),

  // ➕ Add new chat (on create)
  addChat: (chat) => set({ chats: [chat, ...get().chats] }),

  // 💬 Append a new message (user or assistant)
  addMessage: (message) => set({ messages: [...get().messages, message] }),

  // 🧹 Clear messages when switching chat
    clearMessages: () => set({ messages: [] }),
}));
