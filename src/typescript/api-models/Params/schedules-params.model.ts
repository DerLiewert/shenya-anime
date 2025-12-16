export interface SchedulesParams {
  page?: number;
  limit?: number;
  filter?: SchedulesFilter;
  kids?: boolean;
  sfw?: boolean;
  unapproved?: boolean;
}

export const schedulesFilter = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export type SchedulesFilter = (typeof schedulesFilter)[number];
export type SchedulesFilterPlus = SchedulesFilter | 'unknown' | 'other';
