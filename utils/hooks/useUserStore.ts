import { create } from "zustand";
import { getAuth, updateProfile, User as FirebaseUser } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

interface ExtendedUser extends FirebaseUser {
  id?: string;
  avatar?: string;
  followers?: number;
  following?: number;
}

type UserStore = {
  user: ExtendedUser | null;
  setUser: (newUser: ExtendedUser | null) => void;
  updateUserProfile: (updates: Partial<ExtendedUser>) => Promise<void>;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (userState) => set({ user: userState }),
  updateUserProfile: async (updates) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      await updateProfile(currentUser, updates);
      const db = getFirestore();
      const userDocRef = doc(db, "users", currentUser.uid);

      await updateDoc(userDocRef, updates);

      set((state) => ({
        user: {
          ...state.user,
          ...updates,
        } as ExtendedUser,
      }));
    }
  },
}));

export default useUserStore;
