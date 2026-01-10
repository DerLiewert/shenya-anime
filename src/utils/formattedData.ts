import { fallbackValues } from '@/constants';

type SplitOptions = {
  separator: string;
  clearSpaces: boolean;
};
export const splitText = (
  text: string,
  options: SplitOptions = { separator: '\n', clearSpaces: true },
): string[] => {
  const arrayText = text.split(options.separator);
  return options.clearSpaces ? arrayText.filter((val) => val) : arrayText;
};

export const toFirstUppercase = (value: string): string => {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
};

export const formattedScore = (score: number | null): string => {
  if (score === null) return fallbackValues.notAvailable;
  return Number.isInteger(score) ? `${score}.0` : score.toString();
};

// Некоторые обьекты с сервера (например аниме/манга) могут повторяться в массиве несколькор раз с одинаковым mal_id
export const getUniqueItems = <T extends { mal_id: number }>(items: Array<T>): Array<T> => {
  return items.filter(
    (item, index, arr) => index === arr.findIndex((obj) => obj.mal_id === item.mal_id),
  );
};
