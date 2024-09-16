import { create } from "zustand";

export interface AuthStore {
  accessToken?: string;
  setAccessToken: (accessToken: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: undefined,

  setAccessToken: (accessToken) => {
    set(() => ({
      accessToken,
    }));
  },
}));
