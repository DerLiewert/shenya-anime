import { SpecialStatus } from '../variables';

export const formattedScore = (score:  number | null): string => {
  if (score == null) return SpecialStatus.NotAvailable;
  return Number.isInteger(score) ? `${score}.0` : score?.toString();
};

export const splitText = (text: string, separator: string = '\n'): string[] => {
  return text.split(separator);
};

export const toFirstUppercase = (value: string): string => {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
};

// Because some identical anime objects may be repeated
export const uniqueItems= <T extends {mal_id: number}>(items: Array<T>) => {
  return items.filter(
    (item, index, arr) => index === arr.findIndex((obj) => obj.mal_id === item.mal_id),
  );
};
