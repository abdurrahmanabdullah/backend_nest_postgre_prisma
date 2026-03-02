// src/app/api/auth/refresh-session/route.ts
import { authOptions } from "@/lib/auth";
import { API_CONFIG } from "@/lib/config";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = API_CONFIG.getApiUrl(`/auth/refresh-session`);

  try {
    // Call your backend API to get fresh user data and tokens
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh session");
    }

    const data = await response.json();

    // Return the updated session data
    return NextResponse.json(data);
  } catch (error) {
    console.error("Session refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
