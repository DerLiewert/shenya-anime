import {
  animeSearchOrder,
  AnimeSearchOrder,
  AnimeSearchParams,
  AnimeSearchRating,
  animeSearchRating,
  AnimeSearchStatus,
  animeSearchStatus,
  AnimeSearchType,
  animeSearchType,
} from '@/typescript';
import {
  AllowedParams,
  commonParamsValidators,
  parseSearchParams,
  ParamsValidators,
} from './parseSearchParams';

export const animeParamsValidators: ParamsValidators<AnimeSearchParams> = {
  order_by: (v) =>
    animeSearchOrder.includes(v as AnimeSearchOrder) ? (v as AnimeSearchOrder) : undefined,
  type: (v) =>
    animeSearchType.includes(v as AnimeSearchType) ? (v as AnimeSearchType) : undefined,
  status: (v) =>
    animeSearchStatus.includes(v as AnimeSearchStatus) ? (v as AnimeSearchStatus) : undefined,
  rating: (v) =>
    animeSearchRating.includes(v as AnimeSearchRating) ? (v as AnimeSearchRating) : undefined,
  producers: (v) => v,
  ...commonParamsValidators,
};

export const parseAnimeSearchParams = (allowedKeys?: AllowedParams<AnimeSearchParams>) => {
  return (searchParams: string | {}) =>
    parseSearchParams<AnimeSearchParams>(searchParams, animeParamsValidators, allowedKeys);
};
