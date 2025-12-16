import { specialStatus } from '@/constants';
import type { AnimeRating } from '@/typescript';

export const getShortAnimeRating = (rating: AnimeRating | null): string => {
  return rating ? rating.split(' - ')[0] : specialStatus.notAvailable;
};