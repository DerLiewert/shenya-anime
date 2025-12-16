import { monthNames } from '@/constants';
import { AnimeSeasons, animeSeasons } from '@/typescript';

export const getMonthName = (month: number): string => {
  return monthNames[month - 1];
};

export const getSeasonName = (): AnimeSeasons => {
  const month = new Date().getMonth(); // 0 - 11
  const shifted = (month + 1) % 12; // 11 -> 12 -> 0 - декабрь
  const seasonIndex = Math.floor(shifted / 3); 
  return animeSeasons[seasonIndex];
};
