import { parseSearchParams } from '@/pages/Catalog/AnimeCatalogPage';
import { searchParamsToString } from '@/utils';
import { useLocation, useNavigate } from 'react-router-dom';

export function useAppNavigate(defaultParams?: Record<string, any>) {
  const navigate = useNavigate();
  const location = useLocation();

  return (paramsObject: Record<string, any>, options?: { replace?: boolean }) => {
    // const validated = parseSearchParams(searchParamsToString(defaultParams ? {...defaultParams, ...paramsObject} : paramsObject));

    if (defaultParams) {
      for (const param in defaultParams as any) {
        if (paramsObject[param] === defaultParams[param]) delete paramsObject[param];
      }
    }

    const validated = parseSearchParams(searchParamsToString(paramsObject));
    const nextSearch = searchParamsToString(validated);
    const currentSearch = location.search.startsWith('?')
      ? location.search.slice(1)
      : location.search;

    if (currentSearch !== nextSearch) {
      navigate({ search: nextSearch }, { replace: options?.replace ?? false });
    }
  };
}
