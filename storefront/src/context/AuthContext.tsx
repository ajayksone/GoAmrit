"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { sdk } from "@/lib/medusa";

interface AuthContextType {
  customer: any;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      const { customer } = await sdk.store.customer.retrieve();
      setCustomer(customer);
    } catch (e) {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      setIsLoading(true);
      // Medusa 2.0 uses sdk.auth.login for the new auth flow
      // But for backward compatibility or simple store, common endpoints are /auth/customer/login
      // In SDK 2.x, it's typically:
      await (sdk as any).auth.login("emailpass", "customer", {
        email,
        password: pass,
      });
      await checkSession();
    } catch (e) {
      console.error("Login failed:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setIsLoading(true);
      await (sdk as any).auth.register("emailpass", "customer", data);
      await checkSession();
    } catch (e) {
      console.error("Registration failed:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await (sdk as any).auth.logout();
      setCustomer(null);
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ customer, isLoading, login, register, logout, checkSession }}>
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
