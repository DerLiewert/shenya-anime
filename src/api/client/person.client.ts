import { getResource } from './api.client';
import { PersonEndpoints } from '../endpoints/person.endpoints';
import { PersonFull, JikanImages, Person, PersonSearchParams } from '@/models';

export const getPersonFullById = (id: number, signal?: AbortSignal) => {
  return getResource<PersonFull>({
    endpoint: PersonEndpoints.personFullById,
    pathParams: { id },
    signal,
  });
};
export const getPersonPictures = (id: number, signal?: AbortSignal) => {
  return getResource<JikanImages[]>({
    endpoint: PersonEndpoints.personPictures,
    pathParams: { id },
    signal,
  });
};

export const getPersonSearch = (queryParams: Partial<PersonSearchParams>) => {
  return getResource<Person[]>({ endpoint: PersonEndpoints.peopleSearch, queryParams });
};
