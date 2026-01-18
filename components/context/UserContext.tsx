"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

export interface User {
  id: number;
  email: string;
  phone: string;
  name: string;
  picture: string;
  country?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      try {
        setUserState(JSON.parse(cookieUser));
      } catch (err) {
        console.error("Błąd parsowania cookies:", err);
        Cookies.remove("user");
      }
    }
  }, []);

  // ✅ JEDYNE miejsce zarządzania cookies
  const setUser = (user: User | null) => {
    if (user) {
      Cookies.set("user", JSON.stringify(user));
    } else {
      Cookies.remove("user");
    }
    setUserState(user);
  };

  // 🔹 logout = deleguje do setUser
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
