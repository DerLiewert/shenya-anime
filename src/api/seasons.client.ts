import { Anime, AnimeSeason, JikanPaginationPlus, SeasonsListData } from '@/models';
import { getResource } from './api.client';
import { SeasonsEndpoints } from './endpoints/seasons.endpoints';

export const getSeasonsList = () => {
  return getResource<SeasonsListData[]>({
    endpoint: SeasonsEndpoints.seasonsList,
  });
};

export const getSeason = (
  { year, season, page = 1 }: { year: number; season: AnimeSeason; page?: number },
  signal?: AbortSignal,
) => {
  return getResource<Anime[], JikanPaginationPlus>({
    endpoint: SeasonsEndpoints.season,
    pathParams: { year, season },
    queryParams: { page },
    signal,
  });
};
