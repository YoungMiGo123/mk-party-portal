export {
  EmploymentStatus,
  Gender,
  Language,
  Nationality,
  Race,
} from "@/api/generated";

export enum YesNo {
  YES = "Yes",
  NO = "No",
}

export enum Province {
  Gauteng = "Gauteng",
  WesternCape = "Western Cape",
  KwaZuluNatal = "KwaZulu-Natal",
  EasternCape = "Eastern Cape",
  FreeState = "Free State",
  Limpopo = "Limpopo",
  Mpumalanga = "Mpumalanga",
  NorthWest = "North West",
  NorthernCape = "Northern Cape",
}

/**
 * Utility function that returns an array of the enum’s string values.
 *
 * @example
 *   const genderValues = getEnumValues(Gender);
 *   // => ['Male', 'Female', 'Prefer Not To Say', 'Other']
 */
export function getEnumValues<T extends Record<string, string>>(
  enumObj: T
): T[keyof T][] {
  return Object.values(enumObj) as T[keyof T][];
}
