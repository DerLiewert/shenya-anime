import {
  AnimeRating,
  AnimeSearchOrder,
  AnimeSearchRating,
  AnimeSearchStatus,
  AnimeSearchType,
  AnimeStatus,
  AnimeType,
} from '@/models';
import { SelectOption } from '@/typescript';

export const animeTypeOptions: Array<SelectOption<AnimeSearchType, AnimeType>> = [
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'special', label: 'Special' },
  { value: 'tv_special', label: 'TV Special' },
  { value: 'ova', label: 'OVA' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
];

export const animeStatusOptions: Array<SelectOption<AnimeSearchStatus, AnimeStatus>> = [
  { value: 'airing', label: 'Currently Airing' },
  { value: 'complete', label: 'Finished Airing' },
  { value: 'upcoming', label: 'Not yet aired' },
];

export const animeRatingOptions: Array<SelectOption<AnimeSearchRating, AnimeRating>> = [
  { value: 'g', label: 'G - All Ages' },
  { value: 'pg', label: 'PG - Children' },
  { value: 'pg13', label: 'PG-13 - Teens 13 or older' },
  { value: 'r17', label: 'R - 17+ (violence & profanity)' },
  { value: 'r', label: 'R+ - Mild Nudity' },
  { value: 'rx', label: 'Rx - Hentai' },
];

export const animeOrderByOptions: Array<SelectOption<AnimeSearchOrder>> = [
  { value: 'score', label: 'Score' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'mal_id', label: 'ID' },
];
