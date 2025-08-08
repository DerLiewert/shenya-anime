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

  [key: string]: string | number | boolean | undefined;
}

export type SortOptions = 'asc' | 'desc';

export type SearchOrder =
  | 'mal_id'
  | 'title'
  | 'start_date'
  | 'end_date'
  | 'score'
  | 'scored_by'
  | 'rank'
  | 'popularity'
  | 'members'
  | 'favorites';
