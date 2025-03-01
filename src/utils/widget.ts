export function findEnumValue<T extends object>(enumObj: T, value: string): T[keyof T] | null {
  // Check if the value exists in the enum
  if (value in enumObj) {
    return enumObj[value as keyof T];
  }
  return null;
}
