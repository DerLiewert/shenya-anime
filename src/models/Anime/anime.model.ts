import type {
  JikanImages,
  JikanNamedResource,
  JikanResource,
  JikanResourcePeriod,
  JikanResourceRelation,
  JikanResourceTitle,
} from '../Common';
import type { AnimeSeasons } from './anime-season.model';
import type { AnimeTheme } from './anime-theme.model';
import type { AnimeYoutubeVideo } from './anime-video.model';

export interface Anime {
  mal_id: number;
  url: string;
  images: JikanImages;
  trailer: AnimeYoutubeVideo;
  approved: boolean;
  titles: JikanResourceTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: AnimeType | null;
  source: string | null;
  episodes: number | null;
  status: AnimeStatus | null;
  airing: boolean;
  aired: JikanResourcePeriod;
  duration: string | null;
  rating: AnimeRating | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: AnimeSeasons | null;
  year: number | null;
  broadcast: AnimeBroadcast;
  producers: JikanResource[];
  licensors: JikanResource[];
  studios: JikanResource[];
  genres: JikanResource[];
  explicit_genres: JikanResource[];
  themes: JikanResource[];
  demographics: JikanResource[];
}

export interface AnimeFull extends Anime {
  relations: JikanResourceRelation[];
  theme: AnimeTheme;
  external: JikanNamedResource[];
  streaming: JikanNamedResource[];
}

export interface AnimeBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export const animeTypes = ['TV', 'Movie', 'OVA', 'Special', 'ONA', 'Music', 'TV Special'] as const;
export type AnimeType = (typeof animeTypes)[number];

export const animeStatus = ['Finished Airing', 'Currently Airing', 'Not yet aired'] as const;
export type AnimeStatus = (typeof animeStatus)[number];

export const animeRating = [
  'G - All Ages',
  'PG - Children',
  'PG-13 - Teens 13 or older',
  'R - 17+ (violence & profanity)',
  'R+ - Mild Nudity',
  'Rx - Hentai',
] as const;
export type AnimeRating = (typeof animeRating)[number];
