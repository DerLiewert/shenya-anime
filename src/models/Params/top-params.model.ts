import { AnimeSearchRating, AnimeSearchType } from "./anime-params.model";
import { MangaSearchType } from "./manga-params.model";

export interface JikanTopParams {
  page?: number;
  limit?: number;
}

export type TopFilter = 'upcoming' | 'bypopularity' | 'favorite';

// ======== Anime ========
export interface AnimeTopParams extends JikanTopParams {
  type?: AnimeSearchType;
  filter?: TopAnimeFilter;
  rating?: AnimeSearchRating;
  sfw?: boolean;
}

export type TopAnimeFilter = 'airing' | TopFilter;

// ======== Manga ========
export interface MangaTopParams extends JikanTopParams {
  type?: MangaSearchType;
  filter?: TopMangaFilter;
}

export type TopMangaFilter = 'publishing' | TopFilter;
