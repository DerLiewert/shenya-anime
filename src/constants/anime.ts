export const ANIME_TYPE_LABELS = {
  tv: 'TV',
  movie: 'Movie',
  ova: 'OVA',
  special: 'Special',
  ona: 'ONA',
  music: 'Music',
  tv_special: 'TV Special',
  cm: 'CM',
  pv: 'PV',
} as const;


export type AnimeSearchType = keyof typeof ANIME_TYPE_LABELS;
export type AnimeType = (typeof ANIME_TYPE_LABELS)[AnimeSearchType];

export const ANIME_RATING_LABELS = {
  g: 'G - All Ages',
  pg: 'PG - Children',
  pg13: 'PG-13 - Teens 13 or older',
  r17: 'R - 17+ (violence & profanity)',
  r: 'R+ - Mild Nudity',
  rx: 'Rx - Hentai',
} as const;

export const ANIME_STATUS_LABELS = {
  airing: 'Finished Airing',
  complete: 'Currently Airing',
  upcoming: 'Not yet aired',
} as const;
