import {
  Character,
  CharacterFull,
  CharactersSearchParams,
  JikanImages,
  JikanPaginationPlus,
} from '@/typescript';
import { getResource } from './api.client';
import { CharactersEndpoints } from '../endpoints/characters.endpoints';

export const getCharacterFullById = (id: number, signal?: AbortSignal) => {
  return getResource<CharacterFull>({
    endpoint: CharactersEndpoints.characterFullById,
    pathParams: { id },
    signal,
  });
};
export const getCharacterPictures = (id: number, signal?: AbortSignal) => {
  return getResource<JikanImages[]>({
    endpoint: CharactersEndpoints.characterPictures,
    pathParams: { id },
    signal,
  });
};

export const getCharacterSearch = (queryParams: Partial<CharactersSearchParams>) => {
  return getResource<Character[], JikanPaginationPlus>({
    endpoint: CharactersEndpoints.characterSearch,
    queryParams,
  });
};
