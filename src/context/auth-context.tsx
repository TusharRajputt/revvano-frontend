import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { signInWithPopup } from "firebase/auth";
import { authService } from "@/services/auth.service";
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;

  updateUser: (data: Partial<User>) => void;

  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("revvano-token");

        if (!token) {
          setLoading(false);
          return;
        }

        const profile = await authService.getProfile();

        setUser(profile);
      } catch {
        localStorage.removeItem("revvano-token");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const res = await authService.login(email, password);

    setUser(res.user);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const res = await authService.register(
      firstName,
      lastName,
      email,
      password
    );

    setUser(res.user);
  };

  const logout = () => {
    authService.logout();

    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    setUser({
      ...user,
      ...data,
    });
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      throw new Error("Google sign-in isn't configured yet.");
    }

    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const idToken = await result.user.getIdToken();

    const res = await authService.loginWithGoogle(idToken);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}