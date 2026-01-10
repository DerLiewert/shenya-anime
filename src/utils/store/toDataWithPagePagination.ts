import { JikanPaginationBase, JikanResponse, DataWithPagePagination } from '@/typescript';

export function toDataWithPagePagination<T>(
  response: JikanResponse<T[], JikanPaginationBase | undefined>,
  page: number,
): DataWithPagePagination<T> {
  return {
    data: response.data,
    pagination: response.pagination ? { ...response.pagination, current_page: page } : null,
  };
}
