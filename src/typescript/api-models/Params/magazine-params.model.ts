import type { SortOptions } from './search-params.model';

export type MagazineSearchParams = {
  page: number;
  limit: number;
  q: string;
  order_by: MagazineSearchOrder;
  sort: SortOptions;
  letter: string;
};

export type MagazineSearchOrder = 'mal_id' | 'name' | 'count';
