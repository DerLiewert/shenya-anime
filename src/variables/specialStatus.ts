export const SpecialStatus = {
  Unknown: 'Unknown',
  NotAvailable: 'N/A',
  QuestionMark: '?',
} as const;

export type SpecialStatusType = (typeof SpecialStatus)[keyof typeof SpecialStatus];
