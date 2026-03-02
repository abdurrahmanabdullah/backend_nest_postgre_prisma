// src/hooks/useLocaleValue.ts
"use client";

import { useLocale as useNextIntlLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

/**
 * A hook that safely retrieves the current locale from either next-intl or URL path
 * Will gracefully fall back when used outside of NextIntlClientProvider
 */
export function useLocaleValue() {
  const pathname = usePathname();

  // First try to get locale from next-intl context
  let locale: string | undefined;
  try {
    locale = useNextIntlLocale();
  } catch (error) {
    // If context is not available, we'll extract from path below
    console.debug(
      "Next-intl context not available, extracting locale from path"
    );
  }

  // If we couldn't get locale from context, extract it from pathname
  const pathLocale = useMemo(() => {
    if (!pathname) return "en";
    const pathParts = pathname.split("/");
    return pathParts[1] || "en";
  }, [pathname]);

  // Return whichever locale we successfully got
  return locale || pathLocale;
}
