import { AnimeSeasons, animeSeasons, SeasonAnimeType, seasonAnimeType } from '@/models';
import { isEmpty } from '../general';

export const searchParamsToObj = (paramsString: string) => {
  const searchParams = new URLSearchParams(paramsString);
  const paramsObj = Object.fromEntries(searchParams.entries());
  return paramsObj;
};

export const searchParamsToString = (queryParams: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (!isEmpty(value)) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
};

const paramsValidators = {
  year: (value: string) => {
    const year = Number(value);
    return isNaN(year) ? undefined : year;
  },
  season: (value: string) => animeSeasons.includes(value as AnimeSeasons) ? value as AnimeSeasons : undefined,
  filter: (value: string) => seasonAnimeType.includes(value as SeasonAnimeType) ? value as SeasonAnimeType : undefined,
  page: (value: string) => {
    const page = parseInt(value, 10);
    return isNaN(page) ? undefined : page;
  },
  limit: (value: string, limit: number = 25) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : Math.min(num, limit); 
  },
  continuing: (value: string) => value === 'true',
  unapproved: (value: string) => value === 'true',
  sfw: (value: string) => value === 'true',
} as const;

// export const searchParamsToObj = (paramsString: string) => {
//   return Object.fromEntries(new URLSearchParams(paramsString).entries());
// };

// export const objToSearchParams = (obj: Record<string, string | number>) => {
//   return new URLSearchParams(obj).toString();
// };
