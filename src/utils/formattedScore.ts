import { Anime } from '../models';
import { SpecialStatus } from '../variables';

export const formattedScore = (score: Anime['score']): string => {
  if (score == null) return SpecialStatus.NotAvailable;
  return Number.isInteger(score) ? `${score}.0` : score?.toString();
};
