import {
  AnimeSeasons,
  animeSeasons,
  JikanSeasonsPlusParams,
  seasonAnimeType,
  SeasonAnimeType,
} from '@/models';
import {
  AllowedParams,
  commonParamsValidators,
  parseSearchParams,
  ParamsValidators,
} from './parseSearchParams';

export const seasonParamsValidators: ParamsValidators<JikanSeasonsPlusParams> = {
  page: commonParamsValidators.page,
  limit: commonParamsValidators.limit,
  filter: (v) =>
    seasonAnimeType.includes(v as SeasonAnimeType) ? (v as SeasonAnimeType) : undefined,
  season: (v) => (animeSeasons.includes(v as AnimeSeasons) ? (v as AnimeSeasons) : undefined),
  year: (v) => (!isNaN(+v) ? +v : undefined),
  sfw: commonParamsValidators.sfw,
  unapproved: commonParamsValidators.unapproved,
  continuing: (v) => v === 'true',
};

export const parseSeasonAnimeParams =
  <K extends readonly (keyof JikanSeasonsPlusParams)[]>(
    allowedKeys: AllowedParams<JikanSeasonsPlusParams>,
  ) =>
  (search: string) =>
    parseSearchParams<JikanSeasonsPlusParams, K[number]>(
      search,
      seasonParamsValidators,
      allowedKeys,
    );
