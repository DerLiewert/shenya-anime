export const PersonEndpoints = {
  personFullById: '/people/{id}/full',
  personById: '/people/{id}',
  personAnime: '/people/{id}/anime',
  personManga: '/people/{id}/manga',
  personVoiceActors: '/people/{id}/voices',
  personPictures: '/people/{id}/pictures',
  peopleSearch: '/people',
} as const;
