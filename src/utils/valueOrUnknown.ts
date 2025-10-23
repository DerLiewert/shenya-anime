import { specialStatus, SpecialStatusType } from '@/constants';

export function valueOrDefault<
  T,
  Fallback extends string,
>(value: T | null | undefined, fallback?: Fallback): T | Fallback {
  return (value ?? fallback ?? specialStatus.unknown) as T | Fallback;
}

export function arrayOrDefault<
  T,
  Fallback extends SpecialStatusType = typeof specialStatus.unknown,
>(value: any[], fallback?: Fallback): T | Fallback {
  return (value.length > 0 ? value : fallback ?? specialStatus.unknown) as T | Fallback;
}
