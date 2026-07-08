"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permission";

type UserRole = "admin" | "hr" | "employee" | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  permissions: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [role, setRole]               = useState<UserRole>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // 1. Get user doc to find their role
          const userSnap = await getDoc(doc(db, "users", currentUser.uid));
          if (userSnap.exists()) {
            const userRole = userSnap.data().role as UserRole;
            setRole(userRole);

            // 2. Try to load permissions from Firestore roles collection
            if (userRole) {
              try {
                const rolesQ  = query(collection(db, "roles"), where("name", "==", userRole));
                const roleSnap = await getDocs(rolesQ);
                if (!roleSnap.empty) {
                  const perms = roleSnap.docs[0].data().permissions as string[];
                  setPermissions(Array.isArray(perms) ? perms : []);
                } else {
                  // Fall back to static defaults
                  setPermissions(DEFAULT_ROLE_PERMISSIONS[userRole] ?? []);
                }
              } catch {
                setPermissions(DEFAULT_ROLE_PERMISSIONS[userRole] ?? []);
              }
            }
          } else {
            setRole(null);
            setPermissions([]);
          }
        } catch (error) {
          console.error(error);
          setRole(null);
          setPermissions([]);
        }
      } else {
        setRole(null);
        setPermissions([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login  = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  const logout = async () => { await signOut(auth); };

  return (
    <AuthContext.Provider value={{ user, role, permissions, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
