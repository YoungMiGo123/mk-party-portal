import { Province } from "./enums";

// Map each province to its corresponding ward code prefix.
// These prefixes are examples based on common patterns:
// - Johannesburg (Gauteng): "79800"
// - Cape Town (Western Cape): "80000"
// - Durban (KwaZulu-Natal): "74000"
// - East London (Eastern Cape): "86000"
// - Mangaung (Free State): "71000"
export const provinceWardCodesPrefixMap: Record<Province, string> = {
  [Province.Gauteng]: "79800",
  [Province.WesternCape]: "80000",
  [Province.KwaZuluNatal]: "74000",
  [Province.EasternCape]: "86000",
  [Province.FreeState]: "71000",
  [Province.Limpopo]: "76000",
  [Province.Mpumalanga]: "78000",
  [Province.NorthWest]: "79000",
  [Province.NorthernCape]: "82000",
};

/**
 * Normalizes a ward query based on the selected province.
 *
 * This function accepts a ward query string (e.g., "Ward 74", "74", "074", "79800074", etc.)
 * and a province (using the Province enum). If the province is known, it extracts the
 * first digit sequence from the input, pads it to three digits, and prepends the province’s
 * standard prefix. If the input is already in full 8-digit format with the proper prefix,
 * it is returned unchanged.
 *
 * @param searchInput - The user’s ward query.
 * @param province - The selected province.
 * @returns The normalized ward code string.
 */
export function normalizeWardQuery(
  searchInput: string,
  province: Province
): string {
  const prefix = provinceWardCodesPrefixMap[province];
  if (prefix) {
    const trimmedInput = searchInput.trim();

    if (trimmedInput.length === 8 && trimmedInput.startsWith(prefix)) {
      return trimmedInput;
    }

    const digitMatch = trimmedInput.match(/\d+/);
    if (digitMatch) {
      const wardNumStr = digitMatch[0]; // e.g., "74" or "074"

      const wardNum = parseInt(wardNumStr, 10);
      const wardNumberPadded = wardNum.toString().padStart(3, "0");

      return prefix + wardNumberPadded;
    }

    return trimmedInput;
  } else {
    return searchInput;
  }
}

export function isAllDigits(s: string): boolean {
  for (const c of s) {
    if (!/\d/.test(c)) {
      return false;
    }
  }
  return true;
}
