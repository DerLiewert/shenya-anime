import { searchParamsToString } from '@/utils';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useAppNavigate<T>(parseSearchParams: (search: string) => Partial<T>) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (paramsObject: Record<string, any>, options?: { replace?: boolean }) => {
      const validated = parseSearchParams(searchParamsToString(paramsObject));
      const nextSearch = searchParamsToString(validated);
      const currentSearch = location.search.startsWith('?')
        ? location.search.slice(1)
        : location.search;

      if (currentSearch !== nextSearch) {
        navigate({ search: nextSearch }, { replace: options?.replace ?? false });
      }
    },
    [navigate, location.search, parseSearchParams],
  );
}
