// src/types/auth.ts
import { User } from "next-auth";

export interface AuthContextType {
  user: User | null;
  accessToken?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  photo?: string;
  role?: string;
}

export type SocialProvider = "github" | "google";

export interface SocialTokens {
  access_token: string;
  token_type?: string;
}

export interface SocialProfile {
  id: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  avatar_url?: string;
  picture?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    photo: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  ipAddress?: string;
  terms: boolean;
}
