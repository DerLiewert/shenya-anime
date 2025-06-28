import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from './base.const';
import { JikanPaginationBase, JikanResponse } from '@/models';
import limiter from '@/utils/requestLimiter';
import { searchParamsToString } from '@/utils';

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

// export async function getResource<T>(
//   endpoint: string,
//   pathParams: Record<string, unknown> = {},
//   queryParams?: Record<string, unknown>,
// ): Promise<JikanResponse<T>> {
//   const url = buildUrl(endpoint, pathParams, queryParams);
//   const response = await api.get<JikanResponse<T>>(url);
//   return response.data;
// }
// export async function getResource<T, P = JikanPaginationBase>(
//   endpoint: string,
//   pathParams: Record<string, unknown> = {},
//   queryParams?: Record<string, unknown>,
// ): Promise<JikanResponse<T,P>> {
//   const url = buildUrl(endpoint, pathParams, queryParams);
//   const response = await api.get<JikanResponse<T,P>>(url);
//   return response.data;
// }

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

  const response = await limiter.schedule(() => api.request<JikanResponse<T, P>>(config), signal, {
    url,
    label: `[GET ${url}]`,
  });

  // console.log('response', response);
  if (!response.data.data) {
    // Можно логировать или включить больше контекста
    console.log(new Error((response.data as any).message));

    // throw new Promise((resolve, reject) => {
    //   reject(new Error((response.data as any).message || 'Empty response data received from API'));
    // });

    throw new Error((response.data as any).message || 'Empty response data received from API');
  } else {
    // console.log('throw', response);
    return response.data; // ВОТ ТУТ НУЖНО
  }

  //  throw new DOMException('Aborted', 'AbortError');
  // } else {
  //   console.log('else', response);

  // try {
  //   const response = await limiter.schedule(
  //     () => api.request<JikanResponse<T, P>>(config),
  //     signal,
  //     {
  //       url,
  //       label: `[GET ${url}]`,
  //     },
  //   );

  //   if (!response.data.data) {
  //     throw new Error((response.data as any).message ?? 'No data');
  //   }

  //   return response.data;
  // } catch (e) {
  //   // ❗ если вдруг limiter не пробрасывает ошибку — продублируем
  //   throw e;
  // }

  // return limiter.schedule(() => api.request<JikanResponse<T, P>>(config), signal)
  //   .then(res => res.data);
}
