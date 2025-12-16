import { Anime, Manga } from '@/typescript';

const isGenreNsfw = (item: Anime | Manga) => {
  const nsfwGenres = [12, 49];
  return item.genres.find((obj) => nsfwGenres.includes(obj.mal_id)) ? true : false;
};

export const isAnimeNsfw = (item: Anime) => {
  return isGenreNsfw(item) || item.rating === 'Rx - Hentai';
};
export const isMangaNsfw = (item: Manga) => isGenreNsfw(item);
