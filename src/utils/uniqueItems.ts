import { Anime } from '@/models';

// Because some identical anime objects may be repeated
export const uniqueAnime = (items: Anime[]) => {
  return items.filter(
    (item, index, arr) => index === arr.findIndex((obj) => obj.mal_id === item.mal_id),
  );
};
