type Id = string | number;

export const getAnimePaths = (id: Id) => {
  return {
    animeCatalog: '/anime',
    animeFull: `/anime/${id}`,
  };
};
export const getMangaPaths = (id: Id) => {
  return {
    mangaCatalog: '/manga',
    mangaFull: `/manga/${id}`,
  };
};
export const getCharacterPaths = (id: Id) => {
  return {
    characterFull: `/character/${id}`,
  };
};
export const getPersonPaths = (id: Id) => {
  return {
    personFull: `/people/${id}`,
  };
};

export const getAllAppPaths = (id: Id) => {
  return {
    ...getAnimePaths(id),
    ...getMangaPaths(id),
    ...getCharacterPaths(id),
  };
};
