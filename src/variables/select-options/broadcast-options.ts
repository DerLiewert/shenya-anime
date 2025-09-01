import { schedulesFilter, SchedulesFilter } from "@/models";

type SelectOption<T, L = string> = { value: T; label: L };

export const weekDaysOptions:Array<SelectOption<SchedulesFilter>> = schedulesFilter.map((filter) => ({
  value: filter,
  label: filter.slice(0, 1).toUpperCase() + filter.slice(1)
}));