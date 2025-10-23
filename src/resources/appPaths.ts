import { AnimeSearchParams, JikanSeasonsPlusParams, MangaSearchParams } from '@/models';

function pathWithQuery<T extends {}>(path: string, params: T): string {
  const search = new URLSearchParams(params);
  return `${path}?${search.toString()}`;
}

export const appPaths = {
  home: '/',

  anime: '/anime',
  animeWithParams: (params: AnimeSearchParams) => pathWithQuery(appPaths.anime, params),
  animeFull: (id: number) => `${appPaths.anime}/${id}`,

  manga: '/manga',
  mangaWithParams: (params: MangaSearchParams) => pathWithQuery(appPaths.manga, params),
  mangaFull: (id: number) => `${appPaths.manga}/${id}`,

  characterFull: (id: number) => `/character/${id}`,
  personFull: (id: number) => `/people/${id}`,
  producerFull: (id: number) => `/producer/${id}`,

  schedules: '/schedules',
  broadcast: '/schedules/broadcast',
  seasonal: '/schedules/seasonal',
  seasonalWithParams: (params: JikanSeasonsPlusParams) => pathWithQuery(appPaths.seasonal, params),

  bookmark: '/bookmark',
  notFound: '/not-found',
} as const;

const paths = {
  home: { path: '/' },
  anime: {
    path: '/anime',
    children: {
      full: {
        path: (id: number) => `/${id}`,
        children: {
          details: { path: '/details' },
          episodes: { path: '/episodes' },
        },
      },
    },
  },
  schedules: {
    path: '/schedules',
    children: {
      broadcast: { path: '/broadcast' },
      seasonal: { path: '/seasonal' },
    },
  },
};
