// src/utils/translationHelpers.ts

/**
 * Helper function to safely get translation values
 * This avoids repetitive type casting throughout the codebase
 */
export const getTranslation = (
  translations: Record<string, unknown>,
  key: string,
  fallback: string = key
): string => {
  const value = translations[key];
  return typeof value === "string" ? value : fallback;
};

/**
 * Type-safe translation object converter
 * Converts the translations object to a Record<string, string> for easier access
 */
export const toTranslationRecord = (
  translations: Record<string, unknown>
): Record<string, string> => {
  return translations as Record<string, string>;
};
