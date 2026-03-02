"use client";
import { useLocaleValue } from "@/hooks/useLocaleValue";
import { API_CONFIG } from "@/lib/config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

// Define the token response type
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Public fetch that doesn't require authentication
export function usePublicFetch() {
  const publicFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const url = API_CONFIG.getApiUrl(path);
      return fetch(url, options);
    },
    []
  );

  return publicFetch;
}

export function useAuthFetch() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const locale = useLocaleValue();

  // Define the proper return type
  const refreshToken = useCallback(async (): Promise<TokenResponse | null> => {
    if (isRefreshing) return null;

    setIsRefreshing(true);
    try {
      const url = API_CONFIG.getApiUrl(`/auth/refresh-token`);
      // Call your backend API to refresh the token
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          refreshToken: session?.user?.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();

      // Update the session with new tokens
      await update({
        ...session,
        user: {
          ...session?.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });

      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [session, update, isRefreshing]);

  const authFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      // Check for access token and redirect if not available
      if (!session?.user?.accessToken) {
        console.error("No access token available, redirecting to login");
        // Add the redirect here before throwing the error
        router.push(`/${locale}/login`);
        toast.error("Please login to continue.");
        throw new Error("No access token available");
      }

      const url = API_CONFIG.getApiUrl(path);

      try {
        // Try the request with current token
        let response = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
            ...options.headers,
          },
        });

        // If unauthorized, try to refresh the token and retry
        if (response.status === 401) {
          const tokensResult = await refreshToken();

          if (tokensResult === null) {
            // If refresh failed, redirect to login
            router.push(`/${locale}/login`);
            toast.error("Your session has expired. Please login again.");
            throw new Error("Session expired");
          }

          // Retry with new token
          response = await fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${tokensResult.accessToken}`,
              ...options.headers,
            },
          });
        }

        return response;
      } catch (error) {
        // If it's a network error or other fetch error
        if (
          !(
            error instanceof Error &&
            error.message === "No access token available"
          )
        ) {
          console.error("API request error:", error);
          toast.error("An error occurred while communicating with the server.");
        }
        throw error;
      }
    },
    [session, router, refreshToken, locale]
  );

  return authFetch;
}
