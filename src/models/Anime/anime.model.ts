import type {
  JikanImages,
  JikanNamedResource,
  JikanResource,
  JikanResourcePeriod,
  JikanResourceRelation,
  JikanResourceTitle,
} from '../Common';
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
  season: AnimeSeason | null;
  year: number | null;
  broadcast: AnimeBroadcast;
  producers: JikanResource[];
  licensors: JikanResource[];
  studios: JikanResource[];
  genres: JikanResource[];
  explicit_genres: JikanResource[];
  themes: JikanResource[];
  demographics: JikanResource[];
  relations?: JikanResourceRelation[];
  theme?: AnimeTheme;
  external?: JikanNamedResource[];
  streaming?: JikanNamedResource[];
}

export interface AnimeBroadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface AnimeTheme {
  openings: string[];
  endings: string[];
}

export const animeTypes = ['TV', 'Movie', 'OVA', 'Special', 'ONA', 'Music', 'TV Special'] as const;
export type AnimeType = (typeof animeTypes)[number];

// export type AnimeType = 'TV' | 'Movie' | 'OVA' | 'Special' | 'ONA' | 'Music';

// export enum AnimeType {
//   TV = 'TV',
//   Movie = 'Movie',
//   OVA = 'OVA',
//   Special = 'Special',
//   ONA = 'ONA',
//   Music = 'Music',
// }

export const animeStatus = ['Finished Airing', 'Currently Airing', 'Not yet aired'] as const;
export type AnimeStatus = (typeof animeStatus)[number];

// export enum AnimeStatus {
//   FinishedAiring = 'Finished Airing',
//   CurrentlyAiring = 'Currently Airing',
//   NotYetAired = 'Not yet aired',
// }

// export enum AnimeRating {
//   G = 'G - All Ages',
//   PG = 'PG - Children',
//   PG13 = 'PG-13 - Teens 13 or older',
//   R17 = 'R - 17+ (violence & profanity)',
//   R = 'R+ - Mild Nudity',
//   Rx = 'Rx - Hentai',
// }

export const animeRating = [
  'G - All Ages',
  'PG - Children',
  'PG-13 - Teens 13 or older',
  'R - 17+ (violence & profanity)',
  'R+ - Mild Nudity',
  'Rx - Hentai',
] as const;
export type AnimeRating = (typeof animeRating)[number];

// export enum AnimeRating {
//   G = 'G - All Ages',
//   PG = 'PG - Children',
//   PG13 = 'PG-13 - Teens 13 or older',
//   R17 = 'R - 17+ (violence & profanity)',
//   R = 'R+ - Mild Nudity',
//   Rx = 'Rx - Hentai',
// }

export enum AnimeSeason {
  Spring = 'spring',
  Summer = 'summer',
  Fall = 'fall',
  Winter = 'winter',
}
