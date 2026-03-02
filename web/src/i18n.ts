// src/i18n.ts
import { DEFAULT_LOCALE, LOCALES } from "@/config/site";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the Promise directly since requestLocale is already a Promise
  const locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound();
  }

  try {
    // Dynamic import of the messages file
    const messages = await import(`../messages/${locale}.json`);

    return {
      messages: messages.default,
      timeZone: "UTC",
      locale,
      defaultTranslationValues: {
        appName: messages.default.appName,
      },
    };
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to default locale if message loading fails
    const defaultMessages = await import(`../messages/${DEFAULT_LOCALE}.json`);
    return {
      messages: defaultMessages.default,
      timeZone: "UTC",
      locale: DEFAULT_LOCALE,
      defaultTranslationValues: {
        appName: defaultMessages.default.appName,
      },
    };
  }
});
