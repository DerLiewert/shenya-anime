import { JikanImages } from '../models';

export const getImageUrl = (images: JikanImages | null) => {
  if (!images) return;

  const imagesCollection = images.webp ? images.webp : images.jpg;
  const imageUrl = imagesCollection.large_image_url
    ? imagesCollection.large_image_url
    : imagesCollection.image_url;
  return imageUrl ? imageUrl : undefined;
};
