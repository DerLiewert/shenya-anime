import { SpecialStatus } from '../variables';

export const formattedScore = (score:  number | null): string => {
  if (score == null) return SpecialStatus.NotAvailable;
  return Number.isInteger(score) ? `${score}.0` : score?.toString();
};

export const splitText = (text: string, separator: string = '\n'): string[] => {
  return text.split(separator);
};

// Because some identical anime objects may be repeated
export const uniqueItems= <T,>(items: Array<T & {mal_id: number}>) => {
  return items.filter(
    (item, index, arr) => index === arr.findIndex((obj) => obj.mal_id === item.mal_id),
  );
};
