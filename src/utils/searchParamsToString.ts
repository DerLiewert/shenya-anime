import { isEmpty } from './isEmpty';

export const searchParamsToString = (queryParams: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (!isEmpty(value)) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
};
