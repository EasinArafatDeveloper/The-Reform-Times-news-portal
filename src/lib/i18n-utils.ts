import { getDictionary } from "@/i18n/config";

/**
 * Gets a localized string from a bilingual object.
 * Example: getLocalizedContent({ en: "Hello", bn: "হ্যালো" }, "bn") -> "হ্যালো"
 */
export function getLocalizedContent<T>(content: any, lang: string): T {
  if (!content) return "" as any;
  if (typeof content === 'string') return content as any;
  return (content[lang] || content['bn'] || content['en'] || "") as T;
}

/**
 * Gets a UI translation string by key.
 */
export function getTranslation(lang: string, key: any) {
  const dict = getDictionary(lang);
  return (dict as any)[key] || key;
}
