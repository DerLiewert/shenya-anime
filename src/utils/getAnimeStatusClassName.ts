import { AnimeStatus } from '../models';
import { SpecialStatus } from '../variables';
import { valueOrDefault } from './valueOrUnknown';

type StatusClass = '_released' | '_ongoing' | '_anons' | '_unknown';

// const statusClassNames: Record<AnimeStatus | typeof SpecialStatus.Unknown, StatusClass> = {
//   [AnimeStatus.FinishedAiring]: '_released',
//   [AnimeStatus.CurrentlyAiring]: '_ongoing',
//   [AnimeStatus.NotYetAired]: '_anons',
//   [SpecialStatus.Unknown]: '_unknown',
// };


const statusClassNames: Record<AnimeStatus | typeof SpecialStatus.Unknown, StatusClass> = {
  'Finished Airing': '_released',
  'Currently Airing': '_ongoing',
  'Not yet aired': '_anons',
  [SpecialStatus.Unknown]: '_unknown',
};

export const getAnimeStatusClassName = (status: AnimeStatus | null): string => {
  return statusClassNames[valueOrDefault(status)];
};
