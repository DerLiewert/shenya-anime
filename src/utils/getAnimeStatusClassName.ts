import { AnimeStatus, MangaStatus } from '../models';
import { SpecialStatus } from '../variables';
import { valueOrDefault } from './valueOrUnknown';

type StatusClass = '_released' | '_ongoing' | '_anons' | '_unknown';

// const statusClassNames: Record<AnimeStatus | typeof SpecialStatus.Unknown, StatusClass> = {
//   [AnimeStatus.FinishedAiring]: '_released',
//   [AnimeStatus.CurrentlyAiring]: '_ongoing',
//   [AnimeStatus.NotYetAired]: '_anons',
//   [SpecialStatus.Unknown]: '_unknown',
// };

const statusClassNames: Record<
  AnimeStatus | MangaStatus | typeof SpecialStatus.Unknown,
  StatusClass
> = {
  'Finished Airing': '_released',
  'Currently Airing': '_ongoing',
  'Not yet aired': '_anons',

  Finished: '_released',
  Publishing: '_ongoing',
  'On Hiatus': '_ongoing',
  Discontinued: '_anons',
  'Not yet published': '_anons',

  [SpecialStatus.Unknown]: '_unknown',
};

export const getAnimeStatusClassName = (status: AnimeStatus | MangaStatus | null): string => {
  return statusClassNames[valueOrDefault(status)];
};
