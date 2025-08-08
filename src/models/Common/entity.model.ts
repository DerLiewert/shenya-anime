import type { JikanImages } from "./image.model";

export interface JikanEntity {
  mal_id: number;
  url: string;
  images: JikanImages;
}
