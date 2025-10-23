export interface JikanSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  score?: number;
  min_score?: number;
  max_score?: number;
  sfw?: boolean;
  genres?: string;
  genres_exclude?: string;
  sort?: SortOptions;
  letter?: string;
  start_date?: string;
  end_date?: string;
  unapproved?: boolean;
}

export const sortOptions = ['asc', 'desc'] as const;
export type SortOptions = (typeof sortOptions)[number];

export const searchOrder = [
  'mal_id',
  'title',
  'start_date',
  'end_date',
  'score',
  'scored_by',
  'rank',
  'popularity',
  'members',
  'favorites',
] as const;
export type SearchOrder = (typeof searchOrder)[number];
