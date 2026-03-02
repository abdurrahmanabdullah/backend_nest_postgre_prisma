// src/config/site.ts
type Locale =
  | "en"
  | "de"
  | "it"
  | "fr"
  | "zh"
  | "es"
  | "ja"
  | "ko"
  | "pt"
  | "ru"
  | "ar";

type LOCALE_LABEL = Record<Locale, { label: string; emoji: string }>;

export const LOCALES = [
  "en",
  "de",
  "it",
  "fr",
  "zh",
  "es",
  "ja",
  "ko",
  "pt",
  "ru",
  "ar",
] as const;

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: LOCALE_LABEL = {
  en: { label: "English", emoji: "🇺🇸" },
  de: { label: "Deutsch", emoji: "🇩🇪" },
  it: { label: "Italiano", emoji: "🇮🇹" },
  fr: { label: "Français", emoji: "🇫🇷" },
  zh: { label: "中文 (简体)", emoji: "🇨🇳" },
  es: { label: "Español", emoji: "🇪🇸" },
  ja: { label: "日本語", emoji: "🇯🇵" },
  ko: { label: "한국어", emoji: "🇰🇷" },
  pt: { label: "Português", emoji: "🇵🇹" },
  ru: { label: "Русский", emoji: "🇷🇺" },
  ar: { label: "العربية", emoji: "🇸🇦" },
};
