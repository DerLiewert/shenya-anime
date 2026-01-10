import { JikanPaginationBase } from '@/typescript';

export type PagePagination = JikanPaginationBase & { current_page: number };

export type DataWithPagePagination<T> = {
  data: T[];
  pagination: (JikanPaginationBase & { current_page: number }) | null;
};
