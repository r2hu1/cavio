"use client";
import { useSession } from "@/lib/auth-client";
import Preloader from "@/modules/preloader/views/ui";
import { createContext, useContext } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isPending, refetch } = useSession();

  return (
    <AuthContext.Provider value={{ data, error, isPending, refetch }}>
      {children}
      {isPending && <Preloader />}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthContext);
