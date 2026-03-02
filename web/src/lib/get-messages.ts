// src/lib/get-messages.ts
import { LOCALES } from '@/config/site';

export async function getMessages(locale: string) {
  const defaultLocale = 'en';
  
  // If locale is not supported, use default locale
  const safeLocale = LOCALES.includes(locale as any) ? locale : defaultLocale;
  
  try {
    return (await import(`../../messages/${safeLocale}.json`)).default;
  } catch {
    return (await import(`../../messages/en.json`)).default;
  }
}