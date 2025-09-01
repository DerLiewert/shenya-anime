import type { SortOptions } from './search-params.model';

export interface PersonSearchParams {
  page?: number;
  limit?: number;
  q?: string;
  order_by?: PersonSearchOrder;
  sort?: SortOptions;
  letter?: string;
}

export type PersonSearchOrder = 'mal_id' | 'name' | 'favorites' | 'birthday';
