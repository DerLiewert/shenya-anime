import {
  mangaSearchOrder,
  MangaSearchOrder,
  MangaSearchParams,
  mangaSearchStatus,
  MangaSearchStatus,
  mangaSearchType,
  MangaSearchType,
} from '@/models';
import {
  AllowedParams,
  commonParamsValidators,
  parseSearchParams,
  ParamsValidators,
} from './parseSearchParams';


export const mangaParamsValidators: ParamsValidators<MangaSearchParams> = {
  order_by: (v) =>
    mangaSearchOrder.includes(v as MangaSearchOrder) ? (v as MangaSearchOrder) : undefined,
  type: (v) =>
    mangaSearchType.includes(v as MangaSearchType) ? (v as MangaSearchType) : undefined,
  status: (v) =>
    mangaSearchStatus.includes(v as MangaSearchStatus) ? (v as MangaSearchStatus) : undefined,
  magazines: (v) => v,
  ...commonParamsValidators,
};


export const parseMangaParams =
  <K extends readonly (keyof MangaSearchParams)[]>(allowedKeys: AllowedParams<MangaSearchParams>) =>
  (search: string) =>
    parseSearchParams<MangaSearchParams, K[number]>(search, mangaParamsValidators, allowedKeys);
