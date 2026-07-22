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
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permission";

type UserRole = string | null;

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
            const userRole = String(userSnap.data().role ?? "").trim().toLowerCase() || null;
            setRole(userRole);

            // 2. Load permissions from Firestore roles collection
            if (userRole) {
              const normalizedRole = userRole;

              // Admin always gets full permissions — no Firestore lookup needed
              if (normalizedRole === "admin") {
                setPermissions(DEFAULT_ROLE_PERMISSIONS["admin"]);
              } else {
                try {
                  const allRoles = await getDocs(collection(db, "roles"));
                  const matched  = allRoles.docs.find(
                    (d) => d.data().name?.toLowerCase() === normalizedRole
                  );
                  if (matched) {
                    const data = matched.data();
                    const raw  = data.Permissions ?? data.permissions;
                    let enabled: string[] = [];
                    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
                      enabled = Object.entries(raw as Record<string, boolean>)
                        .filter(([, v]) => v === true)
                        .map(([k]) => k.toLowerCase());
                    } else if (Array.isArray(raw)) {
                      enabled = raw.map((k: string) => k.toLowerCase());
                      
                    }
                    setPermissions(enabled.length ? enabled : DEFAULT_ROLE_PERMISSIONS[normalizedRole] ?? []);
                  } else {
                    setPermissions(DEFAULT_ROLE_PERMISSIONS[normalizedRole] ?? []);
                  }
                } catch {
                  setPermissions(DEFAULT_ROLE_PERMISSIONS[normalizedRole] ?? []);
                }
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
