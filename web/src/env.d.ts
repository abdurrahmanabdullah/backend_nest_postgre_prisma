// src/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    MIDDLEWARE_SECRET: string;
    NEXT_PUBLIC_API_URL: string;
    INTERNAL_API_URL: string;
  }
}
