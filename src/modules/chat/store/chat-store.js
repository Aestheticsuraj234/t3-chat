import {create} from "zustand";

export const useChatStore = create((set , get)=>({
    activeChatId:null,

    setActiveChatId:(chatId)=>set({activeChatId:chatId})
}))