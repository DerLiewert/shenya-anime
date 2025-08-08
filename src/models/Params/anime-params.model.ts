import { JikanSearchParams, SearchOrder } from './search-params.model';

export interface AnimeSearchParams extends JikanSearchParams {
  type?: AnimeSearchType;
  status?: AnimeSearchStatus;
  rating?: AnimeSearchRating;
  order_by?: AnimeSearchOrder;
  producers?: string;
}

export type AnimeSearchOrder = 'episodes' | SearchOrder;

export const animeSearchType = [
  'tv',
  'movie',
  'ova',
  'special',
  'ona',
  'music',
  'cm',
  'pv',
  'tv_special',
] as const;
export type AnimeSearchType = (typeof animeSearchType)[number];

export const animeSearchStatus = ['airing', 'complete', 'upcoming'] as const;
export type AnimeSearchStatus = (typeof animeSearchStatus)[number];

export const animeSearchRating = ['g', 'pg', 'pg13', 'r17', 'r', 'rx'] as const;
export type AnimeSearchRating = (typeof animeSearchRating)[number];
