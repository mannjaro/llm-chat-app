import { create } from "zustand";
import { user } from "../schema";

type State = {
  userName: string;
  conversationIds: string[];
};

type Action = {
  createAccount: () => void;
  read: () => void;
  update: () => void;
  delete: () => void;
};

export const useAccount = create<State & Action>((set) => ({
  userName: "",
  conversationIds: [],
  createAccount: async () => {
    fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user.$inferInsert),
    });
  },
  read: async () => {
    const res = await fetch(`/api/user/${user.$inferSelect.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  update: async () => {},
  delete: async () => {},
}));
