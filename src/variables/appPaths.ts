import { JikanSeasonsPlusParams } from "@/models";
import { AnimeCatalogParams, MangaCatalogParams } from "@/utils";

type Id = string | number;

export const commonPaths = {
  home: '/',
  anime: '/anime',
  manga: '/manga',
  schedules: '/schedules',
  broadcast: '/schedules/broadcast',
  seasonal: '/schedules/seasonal',
  notFound: '/not-found',
} as const;

export const animePaths = {
  catalog: commonPaths.anime,
  catalogWithParams: (params: AnimeCatalogParams) => pathWithQuery(commonPaths.anime, params),
  seasonalWithParams: (params: JikanSeasonsPlusParams) => pathWithQuery(commonPaths.seasonal, params),
  full: (id: Id) => `${commonPaths.anime}/${id}`,
} as const;

export const mangaPaths = {
  catalog: commonPaths.manga,
  catalogWithParams: (params: MangaCatalogParams) => pathWithQuery(commonPaths.manga, params),
  full: (id: Id) => `${commonPaths.manga}/${id}`,
} as const;

export const characterPaths = {
  full: (id: Id) => `/character/${id}`,
} as const;

export const personPaths = {
  full: (id: Id) => `/people/${id}`,
} as const;

export const producerPaths = {
  full: (id: Id) => `/producer/${id}`,
} as const;

export function pathWithQuery<T extends {}>(path: string, params: T): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value != null) search.set(key, String(value));
  }

  return `${path}?${search.toString()}`;
}
