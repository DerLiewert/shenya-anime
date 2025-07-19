import { SpecialStatus } from '../variables';

export function valueOrDefault<T, Fallback extends string = typeof SpecialStatus.Unknown>(
  value: T | null | undefined,
  fallback: Fallback = SpecialStatus.Unknown as Fallback,
): T | Fallback {
  return value ?? fallback;
}