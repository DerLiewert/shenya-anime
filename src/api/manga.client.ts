import { Manga } from '@/models';
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

// export const getAnimeFullById = (id: number, signal?: AbortSignal) => {
//   return getResource<Anime>({
//     endpoint: AnimeEndpoints.animeFullById,
//     pathParams: { id },
//     signal,
//   });
// };

// export const getAnimeStatistics = (id: number, signal?: AbortSignal) => {
//   return getResource<Statistics>({
//     endpoint: AnimeEndpoints.animeStatistics,
//     pathParams: { id },
//     signal,
//   });
// };

// export const getAnimeCharacters = (id: number, signal?: AbortSignal) => {
//   return getResource<AnimeCharacter[]>({
//     endpoint: AnimeEndpoints.animeCharacters,
//     pathParams: { id },
//     signal,
//   });
// };

// export const getAnimeEpisodes = (id: number, page: number = 1, signal?: AbortSignal) => {
//   return getResource<AnimeEpisode[]>({
//     endpoint: AnimeEndpoints.animeEpisodes,
//     pathParams: { id },
//     queryParams: { page },
//     signal,
//   });
// };

// export const getAnimePictures = (id: number, signal?: AbortSignal) => {
//   return getResource<JikanImages[]>({
//     endpoint: AnimeEndpoints.animePictures,
//     pathParams: { id },
//     signal,
//   });
// };

// export const getAnimeVideos = (id: number, signal?: AbortSignal) => {
//   return getResource<AnimeVideos>({
//     endpoint: AnimeEndpoints.animeVideos,
//     pathParams: { id },
//     signal,
//   });
// };

// export const getAnimeNews = (id: number, page: number = 1, signal?: AbortSignal) => {
//   return getResource<JikanNews[]>({
//     endpoint: AnimeEndpoints.animeNews,
//     pathParams: { id },
//     queryParams: { page },
//     signal,
//   });
// };

// export const getAnimeRecommendations = (id: number, signal?: AbortSignal) => {
//   return getResource<Recommendation[]>({
//     endpoint: AnimeEndpoints.animeRecommendations,
//     pathParams: { id },
//     signal,
//   });
// };

// export const getAnimeStaff = (id: number, signal?: AbortSignal) => {
//   return getResource<AnimeStaff[]>({
//     endpoint: AnimeEndpoints.animeStaff,
//     pathParams: { id },
//     signal,
//   });
// };

// export const getAnimeSearch = (queryParams: Partial<AnimeSearchParams>, signal?: AbortSignal) => {
//   return getResource<Anime[], JikanPaginationPlus>({ endpoint: AnimeEndpoints.animeSearch, queryParams, signal });
// };
