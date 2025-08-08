import { JikanPaginationBase, JikanResponse } from "@/models";
import { DataWithExtendedBasicPagination } from "@/typescript";

export function toDataWithExtendedBasicPagination<T>(
  response: JikanResponse<T[], JikanPaginationBase | undefined>,
  page: number,
): DataWithExtendedBasicPagination<T> {
  return {
    data: response.data,
    pagination: response.pagination ? { ...response.pagination, current_page: page } : null,
  };
}
