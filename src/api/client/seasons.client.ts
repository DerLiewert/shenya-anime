import {
  Anime,
  AnimeSeason,
  JikanPaginationPlus,
  JikanSeasonsParams,
  SeasonsListData,
} from '@/models';
import { getResource } from './api.client';
import { SeasonsEndpoints } from '../endpoints/seasons.endpoints';

export const getSeasonsList = () => {
  return getResource<SeasonsListData[]>({
    endpoint: SeasonsEndpoints.seasonsList,
  });
};

export const getSeason = (
  {
    year,
    season,
    queryParams = {},
  }: { year: number; season: AnimeSeason; queryParams?: Partial<JikanSeasonsParams> },
  signal?: AbortSignal,
) => {
  return getResource<Anime[], JikanPaginationPlus>({
    endpoint: SeasonsEndpoints.season,
    pathParams: { year, season },
    queryParams: queryParams,
    signal,
  });
};
