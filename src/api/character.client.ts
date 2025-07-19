import { CharacterFull, JikanImages } from '@/models';
import { getResource } from './api.client';
import { CharactersEndpoints } from './endpoints/characters.endpoints';

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
