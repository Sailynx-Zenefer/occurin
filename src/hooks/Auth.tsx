import { Session, User } from "@supabase/supabase-js";
import {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { supabaseClient } from "../config/supabase-client";

// Create a context for authentication

const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  signOut: () => void;
}>({
  session: null,
  user: null,
  signOut: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabaseClient.auth.getSession();
        if (error) throw error;
        setSession(session);
        setUser(session?.user ?? null);
        setInitialized(true);
      } catch (error) {
        console.error("Error getting session:", error);
      }
    };

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setInitialized(true);
      },
    );

    setData();
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signOut: () => supabaseClient.auth.signOut(),
  };

  // Use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {initialized && children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};
