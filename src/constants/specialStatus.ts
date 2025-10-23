export const specialStatus = {
  unknown: 'Unknown',
  notAvailable: 'N/A',
  mark: '?',
} as const;

export type SpecialStatusType = (typeof specialStatus)[keyof typeof specialStatus];
