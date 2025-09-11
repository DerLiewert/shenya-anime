import type { SortOptions } from './search-params.model';

export interface ProducerSearchParams {
  page?: number;
  limit?: number;
  q?: string;
  order_by?: ProducerSearchOrder;
  sort?: SortOptions;
  letter?: string;
}

export type ProducerSearchOrder = 'mal_id' | 'count' | 'favorites' | 'established';
