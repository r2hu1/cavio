"use client";
import { useSession } from "@/lib/auth-client";
import type { Session } from "better-auth";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const RedirectContext = createContext<Session | null>(null);

export const RedirectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cachedSession, setCachedSession] = useState<Session | null>(null);
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  const exclude = ["/auth/forgot-password", "/auth/reset-password"];

  useEffect(() => {
    if (!session.isPending) {
      setCachedSession(session.data?.session ?? null);
    }
  }, [session.isPending, session.data?.session]);

  useEffect(() => {
    if (
      !session.isPending &&
      cachedSession?.id &&
      !exclude.includes(pathname)
    ) {
      router.push("/");
    }
  }, [cachedSession, session.isPending, pathname, router]);

  return (
    <RedirectContext.Provider value={cachedSession}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirect = () => useContext(RedirectContext);
