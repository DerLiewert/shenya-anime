import { AnimeRating } from '../models';
import { SpecialStatus } from '../variables';

// export const divideAnimeRating = (rating: AnimeRating): {name: string, transcript: string} => {
//     const [name, transcript] = rating.split(' - ');
//     return {name, transcript};
// }
export const getShortAnimeRating = (rating: AnimeRating | null): string => {
  return rating ? rating.split(' - ')[0] : SpecialStatus.NotAvailable;
};
// export const getShortAnimeRating = (rating: AnimeRating): string => {
//   return rating.split(' - ')[0];
// };
