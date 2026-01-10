export const isAppendItems = (
  currentPage: number | null | undefined,
  nextPage: number | null | undefined,
): boolean => {
  return currentPage && nextPage && nextPage > currentPage ? true : false;
};
