import { create } from "zustand";
import { UserModel } from "./models";

export interface UserStore {
  user: UserModel;
  isLoading: boolean;

  patchUser: (userPartial: Partial<UserModel>) => void;
  setUser: (user: UserModel) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: {
    _id: undefined,
    id: 0,
    firstName: "",
    lastName: "",
    username: undefined,
    languageCode: "",
  },
  isLoading: true,
  setUser: (user) => {
    set((state) => ({
      ...state,
      user,
      isLoading: false,
    }));
  },
  patchUser: (userPartial: any) => {
    set((state) => {
      return {
        ...state,
        user: {
          ...state.user,
          ...userPartial,
        },
      };
    });
  },
}));
