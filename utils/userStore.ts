import { create } from "zustand";
import { User } from "firebase/auth";

type UserStore = {
  user: User | null;
  setUser: (newUser: User | null) => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (userState) => set({ user: userState }),
}));

export default useUserStore;
