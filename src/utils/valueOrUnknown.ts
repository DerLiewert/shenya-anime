import { fallbackValues } from '@/constants';
import { Nullable } from '@/typescript';

export function valueOrDefault<T>(value: Nullable<T>): T | typeof fallbackValues.unknown;
export function valueOrDefault<T, D>(value: Nullable<T>, defaultValue: D): T | D;
export function valueOrDefault<T, D>(
  value: Nullable<T>,
  defaultValue: D = fallbackValues.unknown as D,
) {
  return value ?? defaultValue;
}

export function arrayOrDefault(value: []): [] | typeof fallbackValues.unknown;
export function arrayOrDefault<F>(value: [], fallback: F): [] | F;
export function arrayOrDefault<F>(value: [], fallback: F = fallbackValues.unknown as F): [] | F {
  return value.length > 0 ? value : fallback;
}
