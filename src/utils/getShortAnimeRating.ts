import { AnimeRating } from '../models';
import { SpecialStatus } from '../variables';

export const getShortAnimeRating = (rating: AnimeRating | null): string => {
  return rating ? rating.split(' - ')[0] : SpecialStatus.NotAvailable;
};