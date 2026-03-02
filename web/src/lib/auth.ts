import { SocialProfile, SocialProvider, SocialTokens } from "@/types/auth";
import { jwtDecode } from "jwt-decode";
import { NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { API_CONFIG } from "./config";

// Environment validation
const REQUIRED_ENV_VARS = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
} as const;

Object.entries(REQUIRED_ENV_VARS).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
});

// Type guard to check if access token exists
const hasAccessToken = (account: any): account is { access_token: string } => {
  return account && typeof account.access_token === "string";
};

async function handleSocialLogin(
  provider: SocialProvider,
  profile: SocialProfile,
  tokens: SocialTokens
) {
  try {
    const response = await fetch(
      API_CONFIG.getApiUrl(`/auth/${provider}/callback`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          profile,
          tokens,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to authenticate with backend");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Social login error:", error);
    throw error;
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    photo: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const parsedCredentials = loginSchema.safeParse(credentials);
          if (!parsedCredentials.success) {
            return null;
          }

          const res = await fetch(API_CONFIG.getApiUrl(`/auth/login`), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(parsedCredentials.data),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message ?? "Invalid credentials");
          }

          const user: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            photo: data.user.photo,
            role: data.user.role,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
          };

          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Ensure baseUrl matches NEXTAUTH_URL
      const nextAuthUrl = process.env.NEXTAUTH_URL || baseUrl;
      if (url.startsWith(nextAuthUrl)) return url;
      if (url.startsWith("/")) return new URL(url, nextAuthUrl).toString();
      return nextAuthUrl;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        // Check if we have the required tokens
        if (!hasAccessToken(account)) {
          console.error("No access token available");
          return false;
        }

        try {
          const data = await handleSocialLogin(
            account.provider as SocialProvider,
            profile as SocialProfile,
            {
              access_token: account.access_token,
              token_type: account.token_type ?? undefined,
            }
          );

          if (user && data.user) {
            user.id = data.user.id;
            user.subscriptionType = data.user.subscriptionType || "free";
            user.accessToken = data.tokens.accessToken;
            user.refreshToken = data.tokens.refreshToken;
            user.photo = data.user.photo;
            user.role = data.user.role;
            user.name = data.user.name;
            user.firstName = data.user.firstName;
            user.lastName = data.user.lastName;
            user.email = data.user.email;
          }

          return true;
        } catch (error) {
          console.error("Social sign in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user: any;
      trigger?: any;
      session?: any;
    }) {
      // User first logs in
      if (user) {
        token.id = user.id;
        token.subscriptionType = user.subscriptionType || "free";
        token.accessToken = user.accessToken;
        token.email = user.email;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.refreshToken = user.refreshToken;
        token.photo = user.photo;
        token.role = user.role;

        // Set expiration if we have an access token
        if (user.accessToken) {
          try {
            const decoded = jwtDecode(user.accessToken);
            token.exp = decoded.exp as number;
          } catch (error) {
            console.error("Failed to decode access token:", error);
            token.exp = Math.floor(Date.now() / 1000) + 3600; // Default to 1 hour
          }
        }
      }

      if (trigger === "update" && session) {
        // Make sure we're accessing the correct structure
        if (session.user) {
          // Update from session.user
          token.accessToken = session.user.accessToken || token.accessToken;
          token.refreshToken = session.user.refreshToken || token.refreshToken;
          token.id = session.user.id || token.id;
          token.email = session.user.email || token.email;
          token.name = session.user.name || token.name;
          token.subscriptionType =
            session.user.subscriptionType || token.subscriptionType;
          token.photo = session.user.photo || token.photo;
          token.role = session.user.role || token.role;
        } else {
          // Direct session properties (fallback)
          Object.keys(session).forEach((key) => {
            if (key !== "user") {
              token[key] = session[key];
            }
          });
        }
      }

      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.subscriptionType = token.subscriptionType;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.role = token.role;
        session.user.photo = token.photo;
      }
      return session;
    },
  },
  debug: true, // process.env.NODE_ENV === "development",
};

export const getAuthSession = () => getServerSession(authOptions);
