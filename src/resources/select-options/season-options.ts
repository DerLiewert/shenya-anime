import { animeSeasons, SeasonAnimeType, SelectOption } from '@/typescript';

export const seasonOptions: Array<SelectOption<SeasonAnimeType>> = animeSeasons.map((season) => ({
  value: season,
  label: season.slice(0, 1).toUpperCase() + season.slice(1),
}));
