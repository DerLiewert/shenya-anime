export const fallbackValues = {
  unknown: 'Unknown',
  notAvailable: 'N/A',
  mark: '?',
} as const;

export type FallbackValue = (typeof fallbackValues)[keyof typeof fallbackValues];
