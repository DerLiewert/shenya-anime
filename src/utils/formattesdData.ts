import { SpecialStatus } from '../variables';

export const formattedScore = (score: number | null): string => {
  if (score == null) return SpecialStatus.NotAvailable;
  return Number.isInteger(score) ? `${score}.0` : score?.toString();
};

export const splitText = (text: string, separator: string = '\n'): string[] => {
  return text.split(separator);
};

export const toFirstUppercase = (value: string): string => {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
};

// Некоторые обьекты с сервера (например аниме/манга) могут посторяться в массиве несколькор раз с одинаковым mal_id
export const getUniqueItems = <T extends { mal_id: number }>(items: Array<T>) => {
  return items.filter(
    (item, index, arr) => index === arr.findIndex((obj) => obj.mal_id === item.mal_id),
  );
};
