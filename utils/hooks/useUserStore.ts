import { create } from "zustand";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

interface ExtendedUser extends FirebaseUser {
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
/* 
const fetchUserData = async (user: FirebaseUser): Promise<ExtendedUser> => {
  const db = getFirestore();
  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (userDoc.exists()) {
    const userData = userDoc.data();
    return {
      ...user,
      avatar: userData.avatar,
      followers: userData.followers,
      following: userData.following,
    } as ExtendedUser;
  } else {
    return {
      ...user,
      followers: 0,
      following: 0,
    } as ExtendedUser;
  }
};

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const extendedUser = await fetchUserData(user);
    useUserStore.getState().setUser(extendedUser);
  } else {
    useUserStore.getState().setUser(null);
  }
}); */

export default useUserStore;
