import { AnimeSeasons } from '../Anime';

export interface JikanSeasonsParams {
  page?: number;
  limit?: number;
  filter?: SeasonAnimeType;
  sfw?: boolean;
  unapproved?: boolean;
  continuing?: boolean;
}
export interface JikanSeasonsPlusParams extends JikanSeasonsParams {
  year: number;
  season: AnimeSeasons;
}

export const seasonAnimeType = ['tv', 'movie', 'ova', 'special', 'ona', 'music'];
export type SeasonAnimeType = (typeof seasonAnimeType)[number];
