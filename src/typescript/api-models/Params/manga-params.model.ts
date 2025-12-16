import { JikanSearchParams, searchOrder } from './search-params.model';

export interface MangaSearchParams extends JikanSearchParams {
  type?: MangaSearchType;
  status?: MangaSearchStatus;
  order_by?: MangaSearchOrder;
  magazines?: string;
}

export const mangaSearchOrder = ['chapters', 'volumes', ...searchOrder] as const;
export type MangaSearchOrder = typeof mangaSearchOrder[number];

export const mangaSearchType = [
  'manga',
  'novel',
  'lightnovel',
  'oneshot',
  'doujin',
  'manhwa',
  'manhua',
] as const;
export type MangaSearchType = (typeof mangaSearchType)[number];

export const mangaSearchStatus = [
  'publishing',
  'complete',
  'hiatus',
  'discontinued',
  'upcoming',
] as const;
export type MangaSearchStatus = (typeof mangaSearchStatus)[number];
