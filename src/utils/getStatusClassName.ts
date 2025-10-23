import { AnimeStatus, MangaStatus } from '@/models';

type StatusClass = '_released' | '_ongoing' | '_anons' | '_unknown';

const statusClassNames: Record<AnimeStatus | MangaStatus, StatusClass> = {
  // anime
  'Finished Airing': '_released',
  'Currently Airing': '_ongoing',
  'Not yet aired': '_anons',

  // manga
  Finished: '_released',
  Publishing: '_ongoing',
  'On Hiatus': '_ongoing',
  Discontinued: '_anons',
  'Not yet published': '_anons',
};

export const getStatusClassName = (status: AnimeStatus | MangaStatus | null): string => {
  return status ? statusClassNames[status] : '_unknown';
};
