export const animeSeasons = ['winter', 'spring', 'summer', 'fall'] as const;
export type AnimeSeason = (typeof animeSeasons)[number];
