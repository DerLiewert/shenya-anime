import { CommonCharacter, JikanImages, JikanNews, JikanPaginationPlus, Manga, MangaSearchParams, Recommendation, Statistics } from '@/models';
import { getResource } from './api.client';
import { MangaEndpoints } from './endpoints/manga.endpoints';

export const getMangaById = (id: number, signal?: AbortSignal) => {
  return getResource<Manga>({
    endpoint: MangaEndpoints.mangaById,
    pathParams: { id },
    signal,
  });
};

export const getMangaFullById = (id: number, signal?: AbortSignal) => {
  return getResource<Manga>({
    endpoint: MangaEndpoints.mangaFullById,
    pathParams: { id },
    signal,
  });
};

export const getMangaStatistics = (id: number, signal?: AbortSignal) => {
  return getResource<Statistics>({
    endpoint: MangaEndpoints.mangaStatistics,
    pathParams: { id },
    signal,
  });
};

export const getMangaCharacters = (id: number, signal?: AbortSignal) => {
  return getResource<CommonCharacter[]>({
    endpoint: MangaEndpoints.mangaCharacters,
    pathParams: { id },
    signal,
  });
};

export const getMangaPictures = (id: number, signal?: AbortSignal) => {
  return getResource<JikanImages[]>({
    endpoint: MangaEndpoints.mangaPictures,
    pathParams: { id },
    signal,
  });
};

export const getMangaNews = (id: number, page: number = 1, signal?: AbortSignal) => {
  return getResource<JikanNews[]>({
    endpoint: MangaEndpoints.mangaNews,
    pathParams: { id },
    queryParams: { page },
    signal,
  });
};

export const getMangaRecommendations = (id: number, signal?: AbortSignal) => {
  return getResource<Recommendation[]>({
    endpoint: MangaEndpoints.mangaRecommendations,
    pathParams: { id },
    signal,
  });
};

export const getMangaSearch = (queryParams: Partial<MangaSearchParams>, signal?: AbortSignal) => {
  return getResource<Manga[], JikanPaginationPlus>({
    endpoint: MangaEndpoints.mangaSearch,
    queryParams,
    signal,
  });
};
