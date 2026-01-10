import { fallbackValues } from '@/constants';
import type { AnimeRating, Nullable } from '@/typescript';

export const getShortAnimeRating = (rating: Nullable<AnimeRating>): string => {
  return rating ? rating.split(' - ')[0] : fallbackValues.notAvailable; // PG-13 - Teens 13 or older => PG-13
};
