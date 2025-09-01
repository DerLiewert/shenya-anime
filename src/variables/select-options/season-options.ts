import { animeSeasons, SeasonAnimeType } from '@/models';

type SelectOption<T, L = string> = { value: T; label: L };

export const seasonOptions: Array<SelectOption<SeasonAnimeType>> = animeSeasons.map((season) => ({
  value: season,
  label: season.slice(0, 1).toUpperCase() + season.slice(1),
}));
