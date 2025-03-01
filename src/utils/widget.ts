export function findEnumValue<T>(type: T, value: string): T | null {
  return T[value as keyof T]
}
