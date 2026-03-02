// src/lib/fetch.ts
import { API_CONFIG } from "./config";
interface FetchWithAuthOptions extends RequestInit {
  accessToken?: string;
}

export async function fetchWithAuth(
  path: string,
  { accessToken, ...options }: FetchWithAuthOptions = {}
) {
  if (!accessToken) {
    throw new Error("No access token provided");
  }

  const url = API_CONFIG.getApiUrl(path);

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  return response;
}
