// src/lib/config.ts
import { Config, Prompt } from "@/types";

const isClient = typeof window !== "undefined";

export const API_CONFIG = {
  // Base URLs for API
  baseUrl:
    typeof window === "undefined"
      ? process.env.INTERNAL_API_URL || "http://localhost:5045/api"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",

  // Helper to get full API URLs
  getApiUrl: (path: string) => {
    const base = API_CONFIG.baseUrl.endsWith("/")
      ? API_CONFIG.baseUrl.slice(0, -1)
      : API_CONFIG.baseUrl;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  },
};

export const pricingConfig = {
  plans: {
    free: { monthly: 0, annual: 0 },
    starter: { monthly: 8, annual: 80 },
    pro: { monthly: 20, annual: 200 },
    enterprise: { monthly: 50, annual: 500 },
  },
};

export const languages = [
  {
    label: "English",
    value: "en",
    flag: "https://cdn-icons-png.flaticon.com/512/555/555526.png",
  },
  {
    label: "日本語",
    value: "ja",
    flag: "https://cdn-icons-png.flaticon.com/512/16183/16183479.png",
  },
];
