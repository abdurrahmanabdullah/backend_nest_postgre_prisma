// src/types/next-auth.d.ts
import "next-auth";
import { JWT } from "next-auth/jwt";
import { User } from "./index";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  // Extend the built-in User type with our custom fields
  interface User {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    subscription_type?: string;
    subscriptionType?: string;
    email_verified_at?: string;
    photo?: string | null;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    photo?: string | null;
    role?: string;
    subscriptionType?: string;
    accessToken?: string;
    refreshToken?: string;
    exp?: number;
  }
}
