import { animeSeasons, SeasonAnimeType } from '@/models';
import { SelectOption } from '@/typescript';

export const seasonOptions: Array<SelectOption<SeasonAnimeType>> = animeSeasons.map((season) => ({
  value: season,
  label: season.slice(0, 1).toUpperCase() + season.slice(1),
}));
