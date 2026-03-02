// src/context/AuthContext.tsx
"use client";

import { AuthContextType } from "@/types/auth";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Extract locale from pathname
  const locale = useMemo(() => {
    if (!pathname) return "en";
    const parts = pathname.split("/");
    return parts[1] || "en";
  }, [pathname]);

  const handleUnauthorized = useCallback(
    async (response: Response) => {
      if (response.status === 401) {
        try {
          await signOut({
            redirect: false,
          });

          router.push(
            `/${locale}/login?callbackUrl=${encodeURIComponent(
              pathname || "/"
            )}`
          );
        } catch (error) {
          console.error("Sign out error:", error);
        }
      }
      return response;
    },
    [router, locale, pathname]
  );

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        return handleUnauthorized(response);
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [handleUnauthorized]);

  const value: AuthContextType = {
    user: session?.user ?? null,
    accessToken: session?.user?.accessToken,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    photo: session?.user?.photo ?? "",
    role: session?.user?.role ?? "",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
