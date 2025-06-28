import { SpecialStatus } from '../variables';

export function valueOrDefault<T, Fallback extends string = typeof SpecialStatus.Unknown>(
  value: T | null | undefined,
  fallback: Fallback = SpecialStatus.Unknown as Fallback,
): T | Fallback {
  return value ?? fallback;
}

/*
--- пустая строка и null/undefined — это «нет значения»
export function valueOrDefault<T, Fallback extends string = typeof SpecialStatus.Unknown>(
  value: T,
  fallback: Fallback = SpecialStatus.Unknown as Fallback
): T | Fallback {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return fallback;
  }

  return value;
}

--- считать 0 или false тоже "пустыми"
export function valueOrDefault<T, Fallback extends string = typeof SpecialStatus.Unknown>(
  value: T,
  fallback: Fallback = SpecialStatus.Unknown as Fallback
): T | Fallback {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (typeof value === 'number' && isNaN(value));

  return isEmpty ? fallback : value;
}
*/

// export function valueOrDefault<T, Fallback extends SpecialStatusType>(
//   value: T | null | undefined,
//   fallback: Fallback = SpecialStatus.Unknown as Fallback,
// ): T | Fallback {
//   return value ? value : fallback;
// }

// export function valueOrUnknown<T>(value: T | null | undefined): T | 'Unknown' {
//   return value ? value : 'Unknown';
// }

// export function valueOrDefault<T, Fallback extends string = SpecialStatus.Unknown>(
//   value: T | null | undefined,
//   fallback: Fallback = SpecialStatus.Unknown as Fallback,
// ): T | Fallback {
//   return value ?? fallback;
// }

// export function valueOrDefault<T, Fallback = 'Unknown'>(
//   value: T | null | undefined,
//   fallback: Fallback = 'Unknown' as Fallback,
// ): T | Fallback {
//   return value ? value : fallback;
// }
