"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const validateToken = async (token: string) => {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(`${BACKEND_URL}/api/auth/validate`);
          setUser(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          Cookies.remove("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
          setIsLoading(false);
          router.push("/login");
        }
      };
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;

      // Set cookie with token (expires in 24 hours)
      Cookies.set("token", token, { expires: 1 });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
