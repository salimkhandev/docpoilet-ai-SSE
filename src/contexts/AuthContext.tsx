"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  userId: string;
  username: string;
  name: string;
  pictureUrl: string | null;
  email: string | null;
  botpress_userId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    password: string,
    name: string,
    pictureUrl?: string,
    email?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/handle-users/me", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch("/api/handle-users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to login");
    }

    setUser(data.data);
  };

  const signup = async (
    username: string,
    password: string,
    name: string,
    pictureUrl?: string,
    email?: string
  ) => {
    const response = await fetch("/api/handle-users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
        name,
        pictureUrl: pictureUrl || "",
        email: email || "",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to create account");
    }

    setUser(data.data);
  };

  const logout = async () => {
    try {
      await fetch("/api/handle-users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

