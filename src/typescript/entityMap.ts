import { Anime, AnimeFull, Character, Manga, MangaFull } from '@/typescript';

export type EntityMap = {
  anime: Anime;
  manga: Manga;
  character: Character;
  'anime-full': AnimeFull;
  'manga-full': MangaFull;
};
export type EntityType = keyof EntityMap;

export type AnimeAndMangaMap = Pick<EntityMap, 'anime' | 'manga'>;
export type AnimeAndMangaType = keyof AnimeAndMangaMap;
export type AnimeAndMangaOf<K extends keyof AnimeAndMangaMap> = EntityMap[K];

// Получить тип по ключу: EntityOf<'anime'>  ->  Anime | AnimeFull
export type EntityOf<K extends keyof EntityMap> = EntityMap[K];

// Получить ключ по типу сущности: EntityKeyOf<Anime>  ->  'anime'
export type EntityKeyOf<T> = {
  [K in keyof EntityMap]: T extends EntityMap[K] ? K : never;
}[keyof EntityMap];
