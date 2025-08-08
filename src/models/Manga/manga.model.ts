import type {
  JikanImages,
  JikanNamedResource,
  JikanResource,
  JikanResourcePeriod,
  JikanResourceRelation,
  JikanResourceTitle,
} from '../Common';

export interface Manga {
  mal_id: number;
  url: string;
  images: JikanImages;
  approved: boolean;
  titles: JikanResourceTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: MangaType | null;
  chapters: number | null;
  volumes: number | null;
  status: MangaStatus;
  publishing: boolean;
  published: JikanResourcePeriod;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  authors: JikanResource[];
  serializations: JikanResource[];
  genres: JikanResource[];
  explicit_genres: JikanResource[];
  themes: JikanResource[];
  demographics: JikanResource[];
}

export interface MangaFull extends Manga {
  relations: JikanResourceRelation[];
  external: JikanNamedResource[];
}

export const mangaTypes = [
  'Manga',
  'Novel',
  'Light Novel',
  'One-shot',
  'Doujinshi',
  'Manhua',
  'Manhwa',
  'OEL',
] as const;
export type MangaType = (typeof mangaTypes)[number];

export const mangaStatus = [
  'Finished',
  'Publishing',
  'On Hiatus',
  'Discontinued',
  'Not yet published',
] as const;
export type MangaStatus = (typeof mangaStatus)[number];

// export type MangaStatus =
// 	| 'Publishing'
// 	| 'Complete'
// 	| 'On Hiatus'
// 	| 'Discontinued'
// 	| 'Upcoming'
