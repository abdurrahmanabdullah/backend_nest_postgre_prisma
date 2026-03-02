// src/lib/session.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getRequiredSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return session;
}

export async function getUserId() {
  const session = await getRequiredSession();
  return session.user.id;
}