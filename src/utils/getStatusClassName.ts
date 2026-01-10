import { AnimeStatus, MangaStatus } from '@/typescript';

enum StatusClass {
  RELEASE = '_released',
  ONGOING = '_ongoing',
  ANONS = '_anons',
  UNKNOWN = '_unknown',
}

const animeStatusClassNames: Record<AnimeStatus, StatusClass> = {
  'Finished Airing': StatusClass.RELEASE,
  'Currently Airing': StatusClass.ONGOING,
  'Not yet aired': StatusClass.ANONS,
};

const mangaStatusClassNames: Record<MangaStatus, StatusClass> = {
  Finished: StatusClass.RELEASE,
  Publishing: StatusClass.ONGOING,
  'On Hiatus': StatusClass.ONGOING,
  Discontinued: StatusClass.ANONS,
  'Not yet published': StatusClass.ANONS,
};

const statusClassNames = {
  ...animeStatusClassNames,
  ...mangaStatusClassNames,
} as const;

export const getStatusClassName = (status: AnimeStatus | MangaStatus | null): string => {
  return status ? statusClassNames[status] : StatusClass.UNKNOWN;
};
