import { schedulesFilter, SchedulesFilter, SelectOption } from '@/typescript';

export const weekDaysOptions: Array<SelectOption<SchedulesFilter>> = schedulesFilter.map(
  (filter) => ({
    value: filter,
    label: filter.slice(0, 1).toUpperCase() + filter.slice(1),
  }),
);
