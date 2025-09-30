// Define the four canonical location codes
export type LocationCode =
  | "F3M163-E" // Wellington Hospital - Emergency Department
  | "F06033-K" // Wellington Hospital - Ward
  | "F3S638-G" // Hutt Hospital - Emergency Department
  | "F06034-A"; // Hutt Hospital - Ward

// Map codes to display names for UI
export const locationLabels: Record<LocationCode, string> = {
  "F3M163-E": "Wellington – Emergency Dept",
  "F06033-K": "Wellington – Ward",
  "F3S638-G": "Hutt – Emergency Dept",
  "F06034-A": "Hutt – Ward",
};

// Helper: get label safely
export const getLocationLabel = (code: LocationCode | null): string => {
  if (!code) return "Unknown Location";
  return locationLabels[code];
};

// group by site, used for equipment
export const sites = {
  Wellington: ["F3M163-E", "F06033-K"] as LocationCode[],
  Hutt: ["F3S638-G", "F06034-A"] as LocationCode[],
  Wards: ["F06033-K","F06034-A"] as LocationCode[],
  HuttED: ["F3S638-G"] as LocationCode[],
  WellingtonED: ["F3M163-E"] as LocationCode[],
};

// check if location is a ward
export const isWardLocation = (code: LocationCode | null) =>
  code ? ['F06033-K', 'F06034-A'].includes(code) : false;