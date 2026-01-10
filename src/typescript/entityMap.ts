import { Anime, Character, Manga } from '@/typescript';

export type AnimeAndMangaMap = {
  anime: Anime;
  manga: Manga;
};
export type AnimeAndMangaType = keyof AnimeAndMangaMap;
export type AnimeAndMangaOf<K extends AnimeAndMangaType> = AnimeAndMangaMap[K];

//================================================================================
export type SearchMap = AnimeAndMangaMap & {
  character: Character;
};
export type SearchType = keyof SearchMap;
export type SearchMapOf<K extends SearchType> = SearchMap[K];
