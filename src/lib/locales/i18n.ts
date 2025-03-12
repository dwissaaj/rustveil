import { derived, writable } from "svelte/store";
import translations from "./translations";

type Locale = keyof typeof translations;
type Translations = typeof translations[Locale];
type TranslationKey = keyof Translations;

// Locale store
export const locale = writable<Locale>("en");
export const locales = Object.keys(translations) as Locale[];


function translate(locale: Locale, key: TranslationKey, vars: Record<string, string> = {}): string {
  if (!key) throw new Error("No key provided to $t()");
  if (!locale) throw new Error(`No translation for key "${key}"`);


  let text = translations[locale][key];

  if (!text) throw new Error(`No translation found for ${locale}.${key}`);


  Object.keys(vars).forEach((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });

  return text;
}
export const t = derived(locale, ($locale) => (key: TranslationKey, vars = {}) =>
  translate($locale, key, vars)
);
