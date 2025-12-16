export interface JikanImagesCollection {
  image_url: string | null;
  small_image_url?: string | null;
  large_image_url?: string | null;
}

export interface JikanImages {
  jpg: JikanImagesCollection;
  webp?: JikanImagesCollection;
}

export interface TrailerImagesCollection {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  maximum_image_url: string | null;
}
