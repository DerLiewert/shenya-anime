import type { JikanImages, JikanNamedResource, JikanResourceTitle } from '../Common';

export interface Producer {
  mal_id: number;
  url: string;
  titles: JikanResourceTitle[];
  images: JikanImages;
  favorites: number;
  count: number;
  established: string | null;
  about: string | null;
}

export interface ProducerFull extends Producer {
  external: JikanNamedResource;
}
