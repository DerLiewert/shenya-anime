import type { AnimeRating, AnimeType } from '../Anime';
import type { MangaType } from '../Manga';

export type SortOptions = 'asc' | 'desc';

export type SearchOrder =
  | 'mal_id'
  | 'title'
  | 'start_date'
  | 'end_date'
  | 'score'
  | 'scored_by'
  | 'rank'
  | 'popularity'
  | 'members'
  | 'favorites';

export type AnimeSearchOrder = 'type' | 'rating' | 'episodes' | SearchOrder;

export const animeSearchStatus = ['airing', 'complete', 'upcoming'] as const;
export type AnimeSearchStatus = (typeof animeSearchStatus)[number];

export const animeSearchRating = ['g', 'pg', 'pg13', 'r17', 'r', 'rx'] as const;
export type AnimeSearchRating = (typeof animeSearchRating)[number];

// export enum AnimeRating {
//   G = 'G - All Ages',
//   PG = 'PG - Children',
//   PG13 = 'PG-13 - Teens 13 or older',
//   R17 = 'R - 17+ (violence & profanity)',
//   R = 'R+ - Mild Nudity',
//   Rx = 'Rx - Hentai',
// }

export type MangaSearchOrder = 'chapters' | 'volumes' | SearchOrder;

export type MangaSearchStatus = 'publishing' | 'complete' | 'hiatus' | 'discontinued' | 'upcoming';

export interface JikanSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  score?: number;
  min_score?: number;
  max_score?: number;
  sfw?: boolean;
  genres?: string;
  genres_exclude?: string;
  sort?: SortOptions;
  letter?: string;
  producers?: string;
  start_date?: string;
  end_date?: string;
  unapproved?: boolean;

  [key: string]: string | number | boolean | undefined;
}

/**
 * QueryParams used in **getMangaSearch** call
 *
 * See also: [Jikan API Documentation](https://docs.api.jikan.moe/#tag/manga/operation/getMangaSearch)
 */
export interface MangaSearchParams extends JikanSearchParams {
  type?: MangaType;
  status?: MangaSearchStatus;
  order_by?: MangaSearchOrder;
  magazines?: string;
}

/**
 * QueryParams used in **getAnimeSearch** call
 *
 * See also: [Jikan API Documentation](https://docs.api.jikan.moe/#tag/anime/operation/getAnimeSearch)
 */
export interface AnimeSearchParams extends JikanSearchParams {
  type?: AnimeType;
  status?: AnimeSearchStatus;
  rating?: AnimeSearchRating;
  order_by?: AnimeSearchOrder;
}
