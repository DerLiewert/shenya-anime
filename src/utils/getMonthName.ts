import { MONTH_NAMES } from '../variables';

export const getMonthName = (month: number): string => {
  return MONTH_NAMES[month - 1];
};
