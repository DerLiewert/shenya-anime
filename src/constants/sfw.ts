import { Anime, AnimeFull, AnimeSearchRating } from '@/typescript';

export const adultAnimeGenres = [12];
export const adultAnimeRating: AnimeSearchRating[] = ['rx'];

export const adultMangaGenres = [12];

function isAdultGenre(id: number) {
  return adultAnimeGenres.includes(id);
}
function isAdultRating(id: AnimeSearchRating) {
  return adultAnimeRating.includes(id);
}
function isAdultAnime(item: Anime | AnimeFull) {
  return item.genres.find((obj) => isAdultGenre(obj.mal_id)); //|| isAdultRating(item.rating);
}
