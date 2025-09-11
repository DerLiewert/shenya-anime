import { AnimeSearchParams, MangaSearchParams } from '@/models';
import { commonPaths } from '@/variables';

export type MangaCatalogParams = Pick<
  MangaSearchParams,
  'type' | 'status' | 'min_score' | 'max_score' | 'genres' | 'order_by' | 'page'
>;

const DEFAULT_PARAMS = {
  //order_by: 'score',
};

export function buildMangaCatalogUrl(params: MangaCatalogParams): string {
  const allParams = { ...DEFAULT_PARAMS, ...params };
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(allParams)) {
    if (value != null) search.set(key, String(value));
  }

  return `${commonPaths.manga}?${search.toString()}`;
}

export type AnimeCatalogParams = Pick<
  AnimeSearchParams,
  'type' | 'status' | 'min_score' | 'max_score' | 'rating' | 'genres' | 'order_by' | 'page'
>;

export function buildAnimeCatalogUrl(params: AnimeCatalogParams): string {
  const allParams = { ...DEFAULT_PARAMS, ...params };
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(allParams)) {
    if (value != null) search.set(key, String(value));
  }

  return `${commonPaths.anime}?${search.toString()}`;
}
