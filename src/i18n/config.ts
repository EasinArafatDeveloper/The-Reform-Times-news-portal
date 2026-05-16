import { en, bn } from "./locales";

export const getDictionary = (locale: string) => {
  return locale === "en" ? en : bn;
};

export const i18n = {
  defaultLocale: "bn",
  locales: ["en", "bn"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
