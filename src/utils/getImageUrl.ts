import { JikanImages } from '../models';

export const getImageUrl = (images: JikanImages | null) => {
  if (!images) return;

  let imagesCollection = images.webp ? images.webp : images.jpg;
  return imagesCollection.large_image_url
    ? imagesCollection.large_image_url
    : imagesCollection.image_url;
};
