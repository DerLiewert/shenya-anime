export const animeSeasons = ['winter', 'spring', 'summer', 'fall'] as const;
export type AnimeSeasons = (typeof animeSeasons)[number];
