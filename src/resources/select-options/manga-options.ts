import {
  MangaSearchOrder,
  MangaSearchStatus,
  MangaSearchType,
  MangaStatus,
  MangaType,
  SelectOption,
} from '@/typescript';

export const mangaTypeOptions: Array<SelectOption<MangaSearchType, MangaType>> = [
  { value: 'manga', label: 'Manga' },
  { value: 'novel', label: 'Novel' },
  { value: 'lightnovel', label: 'Light Novel' },
  { value: 'oneshot', label: 'One-shot' },
  { value: 'doujin', label: 'Doujinshi' },
  { value: 'manhwa', label: 'Manhwa' },
  { value: 'manhua', label: 'Manhua' },
];

export const mangaStatusOptions: Array<SelectOption<MangaSearchStatus, MangaStatus>> = [
  { value: 'complete', label: 'Finished' },
  { value: 'publishing', label: 'Publishing' },
  { value: 'hiatus', label: 'On Hiatus' },
  { value: 'upcoming', label: 'Not yet published' },
  { value: 'discontinued', label: 'Discontinued' },
];

export const mangaOrderByOptions: Array<SelectOption<MangaSearchOrder>> = [
  { value: 'score', label: 'Score' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'mal_id', label: 'ID' },
];
