"use client";
import { useSession } from "@/lib/auth-client";
import { Session } from "better-auth";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

const RedirectContext = createContext<Session | null>(null);

export const RedirectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  const exclude = ["/auth/forgot-password", "/auth/reset-password"];

  useEffect(() => {
    if (session.data?.session) {
      if (!exclude.includes(pathname)) {
        router.push("/dashboard");
      }
    }
  }, [session.data?.session]);

  return (
    <RedirectContext.Provider value={session.data?.session}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirect = () => useContext(RedirectContext);
