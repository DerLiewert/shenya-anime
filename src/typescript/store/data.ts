import { JikanPaginationBase } from '@/models';

export type DataWithExtendedBasicPagination<T> = {
  data: T[];
  pagination: (JikanPaginationBase & { current_page: number }) | null;
};
