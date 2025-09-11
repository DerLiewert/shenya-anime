export const SpecialStatus = {
  unknown: 'Unknown',
  notAvailable: 'N/A',
  mark: '?',
} as const;

export type SpecialStatusType = (typeof SpecialStatus)[keyof typeof SpecialStatus];
