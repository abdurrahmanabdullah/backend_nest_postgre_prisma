// src/hooks/useSessionRefresh.ts
"use client";

import { API_CONFIG } from "@/lib/config";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useSessionRefresh() {
  const { data: session, update } = useSession();

  const refreshSession = useCallback(async () => {
    if (!session?.user?.accessToken) {
      console.error("Session refresh error: No access token available");
      return false;
    }

    try {
      const url = API_CONFIG.getApiUrl(`/auth/refresh-session`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }

        throw new Error(
          errorData && typeof errorData === "object" && "error" in errorData
            ? errorData.error
            : `Failed to refresh session: ${response.status}`
        );
      }

      const responseData = await response.json();

      if (!responseData.user || !responseData.tokens) {
        console.error("Invalid response format from refresh-session endpoint");
        return false;
      }

      // The key fix - provide the data in the right structure for next-auth's update
      try {
        // NextAuth expects user properties at the session.user level
        const updateResult = await update({
          user: {
            ...session?.user,
            ...responseData.user,
            accessToken: responseData.tokens.accessToken,
            refreshToken: responseData.tokens.refreshToken,
          },
        });

        return !!updateResult;
      } catch (updateError) {
        console.error("Failed to update session:", updateError);

        // Fallback - manual reload approach
        sessionStorage.setItem(
          "refreshed_tokens",
          JSON.stringify({
            accessToken: responseData.tokens.accessToken,
            refreshToken: responseData.tokens.refreshToken,
          })
        );

        // Refresh the page to get a fresh session
        window.location.reload();
        return true;
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      return false;
    }
  }, [session, update]);

  return { refreshSession };
}
