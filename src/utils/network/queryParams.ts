import { isEmpty } from '../general';

export const searchParamsToObj = (paramsString: string) => {
  const searchParams = new URLSearchParams(paramsString);
  const paramsObj = Object.fromEntries(searchParams.entries());
  return paramsObj;
};

export const searchParamsToString = (queryParams: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (!isEmpty(value)) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
};
