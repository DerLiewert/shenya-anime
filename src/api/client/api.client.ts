import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from '../base.const';
import { JikanErrorResponse, JikanPaginationBase, JikanResponse } from '@/typescript';

import { limiter, searchParamsToString } from '@/utils';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

function buildUrl(
  path: string,
  pathParams: Record<string, unknown> = {},
  queryParams?: Record<string, unknown>,
): string {
  // Заменяем плейсхолдеры
  const url = path.replace(/{(\w+)}/g, (_, key) => {
    const value = pathParams[key];
    if (value === undefined) {
      throw new Error(`Missing path param: ${key}`);
    }
    return String(value);
  });

  // Если нет query-параметров — просто вернуть путь
  if (!queryParams) return url;

  const queryString = searchParamsToString(queryParams);
  return queryString ? `${url}?${queryString}` : url;
}

interface GetResourceOptions<T, P> {
  endpoint: string;
  pathParams?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
  signal?: AbortSignal;
}

export async function getResource<T, P = JikanPaginationBase>({
  endpoint,
  pathParams = {},
  queryParams,
  signal,
}: GetResourceOptions<T, P>): Promise<JikanResponse<T, P>> {
  const url = buildUrl(endpoint, pathParams, queryParams);

  const config: AxiosRequestConfig = {
    method: 'get',
    url,
    signal,
  };

  const response = await limiter.schedule(
    () => api.request<JikanResponse<T, P> | JikanErrorResponse>(config),
    signal,
    {
      url,
      label: `[GET ${url}]`,
    },
  );

  if ((response.data as JikanResponse<T, P>).data) {
    return response.data as JikanResponse<T, P>;
  } else {
    throw new Error(
      (response.data as JikanErrorResponse).message || 'Empty response data received from API',
    );
  }

  // if (!response.data.data) {
  //   console.log(new Error((response.data as any).message));
  //   throw new Error((response.data as any).message || 'Empty response data received from API');
  // } else {
  //   return response.data;
  // }
}
