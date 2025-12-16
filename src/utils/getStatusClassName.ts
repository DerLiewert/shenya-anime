import { AnimeStatus, MangaStatus } from '@/typescript';

type StatusClass = '_released' | '_ongoing' | '_anons' | '_unknown';

const animeStatusClassNames: Record<AnimeStatus, StatusClass> = {
  'Finished Airing': '_released',
  'Currently Airing': '_ongoing',
  'Not yet aired': '_anons',
};
const mangaStatusClassNames: Record<MangaStatus, StatusClass> = {
  Finished: '_released',
  Publishing: '_ongoing',
  'On Hiatus': '_ongoing',
  Discontinued: '_anons',
  'Not yet published': '_anons',
};

const statusClassNames = {
  ...animeStatusClassNames,
  ...mangaStatusClassNames,
} as const;

export const getStatusClassName = (status: AnimeStatus | MangaStatus | null): string => {
  return status ? statusClassNames[status] : '_unknown';
};
