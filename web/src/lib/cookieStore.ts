"use client";

// A cookie-free alternative for storing temporary local data
// This uses localStorage with fallback to memory storage for SSR

class LocalDataStore {
  private memoryStore: Record<string, string> = {};
  private isClient = typeof window !== "undefined";

  // Store a value
  set(key: string, value: string, options?: { expires?: number }): void {
    if (!this.isClient) {
      // Server-side fallback
      this.memoryStore[key] = value;
      return;
    }

    try {
      // For client-side, use localStorage
      localStorage.setItem(key, value);

      // If expiration is set, store that too
      if (options?.expires) {
        const expiresAt = Date.now() + options.expires * 1000;
        localStorage.setItem(`${key}_expires`, expiresAt.toString());
      }
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      // Fallback to memory store
      this.memoryStore[key] = value;
    }
  }

  // Get a value
  get(key: string): string | null {
    if (!this.isClient) {
      return this.memoryStore[key] || null;
    }

    try {
      // Check expiration first
      const expiresAtStr = localStorage.getItem(`${key}_expires`);
      if (expiresAtStr) {
        const expiresAt = parseInt(expiresAtStr, 10);
        if (Date.now() > expiresAt) {
          // Expired, clean up and return null
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}_expires`);
          return null;
        }
      }

      // Get the value
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return this.memoryStore[key] || null;
    }
  }

  // Remove a value
  remove(key: string): void {
    if (!this.isClient) {
      delete this.memoryStore[key];
      return;
    }

    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_expires`);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      delete this.memoryStore[key];
    }
  }
}

// Create and export a singleton instance
export const dataStore = new LocalDataStore();

// Helper functions that match js-cookie API for easy replacement
export const storeData = {
  set: (
    key: string,
    value: string | object,
    options?: { expires?: number }
  ): void => {
    const valueToStore =
      typeof value === "object" ? JSON.stringify(value) : value;
    dataStore.set(key, valueToStore, options);
  },

  get: (key: string): string | object | null => {
    const value = dataStore.get(key);
    if (!value) return null;

    // Try to parse as JSON if possible
    try {
      return JSON.parse(value);
    } catch {
      // Not JSON, return as is
      return value;
    }
  },

  remove: (key: string): void => {
    dataStore.remove(key);
  },
};

export default storeData;
