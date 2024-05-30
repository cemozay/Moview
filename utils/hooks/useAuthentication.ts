import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FirebaseAuth } from "../../firebaseConfig";
import useUserStore from "./useUserStore";

export function useAuthentication() {
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      FirebaseAuth,
      (userData: User | null) => {
        setUser(userData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [setUser]);

  const user = useUserStore((state) => state.user);

  return {
    user,
    loading,
  };
}
