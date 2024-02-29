import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FirebaseAuth } from "../firebaseConfig";

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (userData) => {
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
  };
}
