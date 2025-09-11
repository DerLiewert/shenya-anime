type Id = string | number;

export const commonPaths = {
  home: '/',
  anime: '/anime',
  manga: '/manga',
  schedules: '/schedules',
  broadcast: '/schedules/broadcast',
  seasonal: '/schedules/seasonal',
  notFound: '/not-found',
} as const;

export const animePaths = {
  catalog: commonPaths.anime,
  full: (id: Id) => `${commonPaths.anime}/${id}`,
} as const;

export const mangaPaths = {
  catalog: commonPaths.manga,
  full: (id: Id) => `${commonPaths.manga}/${id}`,
} as const;

export const characterPaths = {
  full: (id: Id) => `/character/${id}`,
} as const;

export const personPaths = {
  full: (id: Id) => `/people/${id}`,
} as const;