type CatalogParams = {
  genres?: number;
  type?: string;
  rating?: string;
  [key: string]: string | number | undefined;
};

const DEFAULT_PARAMS = {
  order_by: 'score',
};

export function buildCatalogUrl(params: CatalogParams): string {
  const allParams = { ...DEFAULT_PARAMS, ...params };
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(allParams)) {
    if (value != null) search.set(key, String(value));
  }

  return `/catalog?${search.toString()}`;
}
